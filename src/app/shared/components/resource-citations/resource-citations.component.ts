import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Textarea } from 'primeng/textarea';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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

import { CitationsMapper } from '@shared/mappers';
import { CitationStyle, CustomOption, ResourceOverview } from '@shared/models';
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
  currentResource = input.required<ResourceOverview | null>();
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject = new Subject<string>();
  protected customCitation = output<string>();
  protected defaultCitations = select(CitationsSelectors.getDefaultCitations);
  protected isCitationsLoading = select(CitationsSelectors.getDefaultCitationsLoading);
  protected citationStyles = select(CitationsSelectors.getCitationStyles);
  protected isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);
  protected isCustomCitationSubmitting = select(CitationsSelectors.getCustomCitationSubmitting);
  protected styledCitation = select(CitationsSelectors.getStyledCitation);
  citationOptions = CitationsMapper.fromGetCitationStylesResponse([
    {
      id: 'revista-cubana-de-pediatria',
      type: 'citation-styles',
      attributes: {
        title: 'Revista Cubana de Pediatría (Spanish)',
        date_parsed: '2018-06-14T00:31:10.016240',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'the-astronomical-journal',
      type: 'citation-styles',
      attributes: {
        title: 'The Astronomical Journal',
        date_parsed: '2018-06-14T00:31:10.012365',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'vocations-and-learning',
      type: 'citation-styles',
      attributes: {
        title: 'Vocations and Learning',
        date_parsed: '2018-06-14T00:31:10.008746',
        short_title: 'Vocations and Learning',
        summary: null,
      },
      links: {},
    },
    {
      id: 'chemical-physics-letters',
      type: 'citation-styles',
      attributes: {
        title: 'Chemical Physics Letters',
        date_parsed: '2018-06-14T00:31:10.004818',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'expert-review-of-respiratory-medicine',
      type: 'citation-styles',
      attributes: {
        title: 'Expert Review of Respiratory Medicine',
        date_parsed: '2018-06-14T00:31:10.001144',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'new-writing',
      type: 'citation-styles',
      attributes: {
        title: 'New Writing',
        date_parsed: '2018-06-14T00:31:09.997476',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'ams-review',
      type: 'citation-styles',
      attributes: {
        title: 'AMS Review',
        date_parsed: '2018-06-14T00:31:09.993110',
        short_title: 'AMS Rev',
        summary: null,
      },
      links: {},
    },
    {
      id: 'acs-catalysis',
      type: 'citation-styles',
      attributes: {
        title: 'ACS Catalysis',
        date_parsed: '2018-06-14T00:31:09.985253',
        short_title: 'ACS Catal.',
        summary: null,
      },
      links: {},
    },
    {
      id: 'cell-regeneration',
      type: 'citation-styles',
      attributes: {
        title: 'Cell Regeneration',
        date_parsed: '2018-06-14T00:31:09.981701',
        short_title: null,
        summary: null,
      },
      links: {},
    },
    {
      id: 'evidence-based-communication-assessment-and-intervention',
      type: 'citation-styles',
      attributes: {
        title: 'Evidence-Based Communication Assessment and Intervention',
        date_parsed: '2018-06-14T00:31:09.977038',
        short_title: null,
        summary: null,
      },
      links: {},
    },
  ]);
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

  handleUpdateCustomCitation() {
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

  handleDeleteCustomCitation() {
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

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
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
      // const styles = this.citationStyles();
      const styles = this.citationOptions;
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
