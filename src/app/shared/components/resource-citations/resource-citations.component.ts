import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Textarea } from 'primeng/textarea';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { ToastService } from '@osf/shared/services/toast.service';
import { CitationStyle } from '@shared/models/citations/citation-style.model';
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

  resourceId = input.required<string>();
  resourceType = input.required<CurrentResourceType>();
  customCitations = input<string | null>();
  canEdit = input<boolean>(false);

  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);
  private readonly filterSubject = new Subject<string>();

  customCitationChange = output<string>();
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
  }

  setupDefaultCitationsEffect(): void {
    effect(() => {
      const customCitations = this.customCitations();
      const resourceId = this.resourceId();
      const resourceType = this.resourceType();

      if (resourceId && resourceType) {
        this.actions.getDefaultCitations(resourceType, resourceId);
        this.customCitationInput.setValue(customCitations ?? '');
      }
    });
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleGetStyledCitation(event: SelectChangeEvent) {
    const resourceId = this.resourceId();
    const resourceType = this.resourceType();

    if (resourceId && resourceType) {
      this.actions.getStyledCitation(resourceType, resourceId, event.value.id);
    }
  }

  handleUpdateCustomCitation(): void {
    const resourceId = this.resourceId();
    const resourceType = this.resourceType();
    const customCitationText = this.customCitationInput.value?.trim();

    if (resourceId && resourceType && customCitationText) {
      const payload = {
        id: resourceId,
        type: resourceType,
        citationText: customCitationText,
      };

      this.actions.updateCustomCitation(payload).subscribe({
        next: () => {
          this.customCitationChange.emit(customCitationText);
        },
        complete: () => {
          this.toggleEditMode();
        },
      });
    }
  }

  handleDeleteCustomCitation(): void {
    const resourceId = this.resourceId();
    const resourceType = this.resourceType();

    if (resourceId && resourceType) {
      const payload = {
        id: resourceId,
        type: resourceType,
        citationText: '',
      };

      this.actions.updateCustomCitation(payload).subscribe({
        next: () => {
          this.customCitationChange.emit('');
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
    const customCitations = this.customCitations();

    if (customCitations) {
      this.clipboard.copy(customCitations);
      this.toastService.showSuccess('settings.developerApps.messages.copied');
    }
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((filterValue) => this.actions.getCitationStyles(filterValue));
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
}
