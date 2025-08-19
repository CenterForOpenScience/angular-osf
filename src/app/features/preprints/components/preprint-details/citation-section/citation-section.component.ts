import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Divider } from 'primeng/divider';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ResourceType } from '@shared/enums';
import { CitationStyle, CustomOption } from '@shared/models';
import {
  CitationsSelectors,
  GetCitationStyles,
  GetDefaultCitations,
  GetStyledCitation,
  UpdateCustomCitation,
} from '@shared/stores';

@Component({
  selector: 'osf-preprint-citation-section',
  imports: [Accordion, AccordionPanel, AccordionHeader, TranslatePipe, AccordionContent, Skeleton, Divider, Select],
  templateUrl: './citation-section.component.html',
  styleUrl: './citation-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationSectionComponent implements OnInit {
  preprintId = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly filterSubject = new Subject<string>();
  private actions = createDispatchMap({
    getDefaultCitations: GetDefaultCitations,
    getCitationStyles: GetCitationStyles,
    getStyledCitation: GetStyledCitation,
    updateCustomCitation: UpdateCustomCitation,
  });

  protected defaultCitations = select(CitationsSelectors.getDefaultCitations);
  protected areCitationsLoading = select(CitationsSelectors.getDefaultCitationsLoading);
  protected citationStyles = select(CitationsSelectors.getCitationStyles);
  protected areCitationStylesLoading = select(CitationsSelectors.getCitationStylesLoading);
  protected styledCitation = select(CitationsSelectors.getStyledCitation);
  protected citationStylesOptions = signal<CustomOption<CitationStyle>[]>([]);

  protected filterMessage = computed(() => {
    const isLoading = this.areCitationStylesLoading();
    return isLoading
      ? this.translateService.instant('project.overview.metadata.citationLoadingPlaceholder')
      : this.translateService.instant('project.overview.metadata.noCitationStylesFound');
  });

  constructor() {
    this.setupFilterDebounce();
    this.setupCitationStylesEffect();
  }

  ngOnInit() {
    this.actions.getDefaultCitations(ResourceType.Preprint, this.preprintId());
  }

  protected handleCitationStyleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  protected handleGetStyledCitation(event: SelectChangeEvent) {
    this.actions.getStyledCitation(ResourceType.Preprint, this.preprintId(), event.value.id);
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
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
}
