import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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

import { CitationStyle, CustomOption, ResourceOverview } from '@shared/models';
import { ToastService } from '@shared/services';
import {
  CitationsSelectors,
  GetCitationStyles,
  GetDefaultCitations,
  GetStyledCitation,
  UpdateCustomCitation,
} from '@shared/stores';

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
  private readonly translateService = inject(TranslateService);
  isCollectionsRoute = input<boolean>(false);
  currentResource = input.required<ResourceOverview | null>();
  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject = new Subject<string>();
  protected customCitation = output<string>();
  protected defaultCitations = select(CitationsSelectors.getDefaultCitations);
  protected isCitationsLoading = select(CitationsSelectors.getDefaultCitationsLoading);
  protected citationStyles = select(CitationsSelectors.getCitationStyles);
  protected isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);
  protected isCustomCitationSubmitting = select(CitationsSelectors.getCustomCitationSubmitting);
  protected styledCitation = select(CitationsSelectors.getStyledCitation);
  protected citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  protected isEditMode = signal<boolean>(false);
  protected filterMessage = computed(() => {
    const isLoading = this.isCitationStylesLoading();
    return isLoading
      ? this.translateService.instant('project.overview.metadata.citationLoadingPlaceholder')
      : this.translateService.instant('project.overview.metadata.noCitationStylesFound');
  });
  protected customCitationInput = new FormControl('');

  protected actions = createDispatchMap({
    getDefaultCitations: GetDefaultCitations,
    getCitationStyles: GetCitationStyles,
    getStyledCitation: GetStyledCitation,
    updateCustomCitation: UpdateCustomCitation,
  });

  constructor() {
    this.setupFilterDebounce();
    this.setupDefaultCitationsEffect();
    this.setupCitationStylesEffect();
    this.setupDestroyEffect();
  }

  protected setupDefaultCitationsEffect(): void {
    effect(() => {
      const resource = this.currentResource();

      if (resource) {
        this.actions.getDefaultCitations(resource.type, resource.id);
        this.customCitationInput.setValue(resource.customCitation);
      }
    });
  }

  protected handleCitationStyleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  protected handleGetStyledCitation(event: SelectChangeEvent) {
    const resource = this.currentResource();

    if (resource) {
      this.actions.getStyledCitation(resource.type, resource.id, event.value.id);
    }
  }

  protected handleUpdateCustomCitation(): void {
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

  protected handleDeleteCustomCitation(): void {
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

  protected toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  protected copyCitation(): void {
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

  private setupDestroyEffect(): void {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }
}
