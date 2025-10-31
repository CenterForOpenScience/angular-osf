import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Textarea } from 'primeng/textarea';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { ToastService } from '@osf/shared/services/toast.service';
import { CitationStyle } from '@shared/models/citations/citation-style.model';
import { ResourceOverview } from '@shared/models/resource-overview.model';
import { CustomOption } from '@shared/models/select-option.model';
import {
  CitationsSelectors,
  ClearStyledCitation,
  GetCitationStyles,
  GetDefaultCitations,
  GetStyledCitation,
  UpdateCustomCitation,
} from '@shared/stores/citations';

@Component({
  selector: 'osf-resource-citations',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    TranslatePipe,
    AccordionContent,
    Divider,
    Select,
    Button,
    Skeleton,
    Textarea,
    ReactiveFormsModule,
  ],
  templateUrl: './resource-citations.component.html',
  styleUrl: './resource-citations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCitationsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  currentResource = input.required<ResourceOverview | null>();
  canEdit = input<boolean>(false);

  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject = new Subject<string>();

  customCitation = output<string>();
  defaultCitations = select(CitationsSelectors.getDefaultCitations);
  isCitationsLoading = select(CitationsSelectors.getDefaultCitationsLoading);
  citationStyles = select(CitationsSelectors.getCitationStyles);
  isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);
  isCustomCitationSubmitting = select(CitationsSelectors.getCustomCitationSubmitting);
  styledCitation = select(CitationsSelectors.getStyledCitation);
  citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  isEditMode = signal<boolean>(false);

  filterMessage = computed(() =>
    this.isCitationStylesLoading()
      ? 'project.overview.metadata.citationLoadingPlaceholder'
      : 'project.overview.metadata.noCitationStylesFound'
  );

  customCitationInput = new FormControl('');
  readonly hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  actions = createDispatchMap({
    getDefaultCitations: GetDefaultCitations,
    getCitationStyles: GetCitationStyles,
    getStyledCitation: GetStyledCitation,
    updateCustomCitation: UpdateCustomCitation,
    clearStyledCitation: ClearStyledCitation,
  });

  constructor() {
    this.setupFilterDebounce();
    this.setupDefaultCitationsEffect();
    this.setupCitationStylesEffect();
    this.setupCleanup();
  }

  setupDefaultCitationsEffect(): void {
    effect(() => {
      const resource = this.currentResource();

      if (resource) {
        this.actions.getDefaultCitations(resource.type, resource.id);
        this.customCitationInput.setValue(resource.customCitation);
      }
    });
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleGetStyledCitation(event: SelectChangeEvent) {
    const resource = this.currentResource();

    if (resource) {
      this.actions.getStyledCitation(resource.type, resource.id, event.value.id);
    }
  }

  handleUpdateCustomCitation(): void {
    const resource = this.currentResource();
    const customCitationText = this.customCitationInput.value?.trim();

    if (resource && customCitationText) {
      const payload = {
        id: resource.id,
        type: resource.type,
        citationText: customCitationText,
      };

      this.actions.updateCustomCitation(payload).subscribe({
        next: () => {
          this.customCitation.emit(customCitationText);
        },
        complete: () => {
          this.toggleEditMode();
        },
      });
    }
  }

  handleDeleteCustomCitation(): void {
    const resource = this.currentResource();

    if (resource) {
      const payload = {
        id: resource.id,
        type: resource.type,
        citationText: '',
      };

      this.actions.updateCustomCitation(payload).subscribe({
        next: () => {
          this.customCitation.emit('');
        },
        complete: () => {
          this.toggleEditMode();
        },
      });
    }
  }

  toggleEditMode(): void {
    if (this.styledCitation()) {
      this.actions.clearStyledCitation();
    }
    this.isEditMode.set(!this.isEditMode());
  }

  copyCitation(): void {
    const resource = this.currentResource();

    if (resource?.customCitation) {
      this.clipboard.copy(resource.customCitation);
      this.toastService.showSuccess('settings.developerApps.messages.copied');
    }
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        this.actions.getCitationStyles(filterValue);
      });
  }

  private setupCitationStylesEffect(): void {
    effect(() => {
      const styles = this.citationStyles();

      const options = styles.map((style: CitationStyle) => ({
        label: style.title,
        value: style,
      }));
      this.citationStylesOptions.set(options);
    });
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }
}
