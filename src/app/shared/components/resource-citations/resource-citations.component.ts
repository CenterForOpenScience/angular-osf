import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Divider } from 'primeng/divider';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';

import { ResourceType } from '@shared/enums';
import { CitationStyle, CustomOption, ResourceOverview } from '@shared/models';
import { CitationsSelectors, GetCitationStyles, GetDefaultCitations } from '@shared/stores';

@Component({
  selector: 'osf-resource-citations',
  imports: [Accordion, AccordionPanel, AccordionHeader, TranslatePipe, AccordionContent, Divider, Select],
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
  protected defaultCitations = select(CitationsSelectors.getDefaultCitations);
  protected isCitationsLoading = select(CitationsSelectors.getDefaultCitationsLoading);
  protected citationStyles = select(CitationsSelectors.getCitationStyles);
  protected isCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);

  protected citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);
  protected selectedCitationStyle = signal<CitationStyle | null>(null);
  protected isEditMode = signal<boolean>(false);
  protected filterMessage = computed(() => {
    const isLoading = this.isCitationStylesLoading();
    return isLoading
      ? this.translateService.instant('project.overview.metadata.citationLoadingPlaceholder')
      : this.translateService.instant('project.overview.metadata.noCitationStylesFound');
  });

  protected actions = createDispatchMap({
    getDefaultCitations: GetDefaultCitations,
    getCitationStyles: GetCitationStyles,
  });

  protected readonly resourceTypeMap = new Map<string, ResourceType>([
    ['nodes', ResourceType.Project],
    ['registrations', ResourceType.Registration],
    ['preprints', ResourceType.Preprint],
  ]);

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
        const resourceType = this.resourceTypeMap.get(resource.type)!;
        this.actions.getDefaultCitations(resourceType, resource.id);
      }
    });
  }

  handleCitationStyleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleCitationStyleChange(event: SelectChangeEvent) {
    this.selectedCitationStyle.set(event.value);
    // TODO: Implement citation generation with selected style
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
