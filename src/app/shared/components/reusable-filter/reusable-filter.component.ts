import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';

import { delay, of } from 'rxjs';

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FILTER_PLACEHOLDERS } from '@osf/shared/constants';
import { DiscoverableFilter, FilterOption } from '@osf/shared/models';

import { GenericFilterComponent } from '../generic-filter/generic-filter.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-reusable-filters',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    AutoCompleteModule,
    ReactiveFormsModule,
    GenericFilterComponent,
    TranslatePipe,
    LoadingSpinnerComponent,
    Checkbox,
    NgClass,
    FormsModule,
  ],
  templateUrl: './reusable-filter.component.html',
  styleUrls: ['./reusable-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableFilterComponent {
  filters = input<DiscoverableFilter[]>([]);
  selectedOptions = input<Record<string, FilterOption | null>>({});
  filterSearchResults = input<Record<string, FilterOption[]>>({});
  isLoading = input<boolean>(false);
  showEmptyState = input<boolean>(true);
  plainStyle = input<boolean>(false);

  readonly Boolean = Boolean;

  loadFilterOptions = output<DiscoverableFilter>();
  filterOptionChanged = output<{ filter: DiscoverableFilter; filterOption: FilterOption | null }>();
  filterSearchChanged = output<{ filter: DiscoverableFilter; searchText: string }>();
  loadMoreFilterOptions = output<DiscoverableFilter>();

  private readonly expandedFilters = signal<Set<string>>(new Set());
  private destroyRef = inject(DestroyRef);
  readonly FILTER_PLACEHOLDERS = FILTER_PLACEHOLDERS;

  readonly hasFilters = computed(() => {
    return this.filters().length > 0;
  });

  readonly visibleFilters = computed(() => {
    return this.filters().filter((filter) => this.shouldShowFilter(filter));
  });

  readonly hasVisibleFilters = computed(() => {
    return this.visibleFilters().length > 0;
  });

  readonly groupedFilters = computed(() => {
    const filters = this.visibleFilters();
    const individualFilters: DiscoverableFilter[] = [];
    const isPresentFilters: DiscoverableFilter[] = [];

    filters.forEach((filter) => {
      if (filter.operator === 'is-present') {
        isPresentFilters.push(filter);
      } else if (filter.operator.includes('any-of') || filter.operator.includes('at-date')) {
        individualFilters.push(filter);
      }
    });

    return {
      individual: individualFilters,
      grouped:
        isPresentFilters.length > 0
          ? [
              {
                key: 'is-present-group',
                label: 'Additional Filters',
                type: 'group' as const,
                operator: 'is-present',
                filters: isPresentFilters,
                options: [],
                isLoading: false,
                isLoaded: true,
              },
            ]
          : [],
    };
  });

  constructor(private el: ElementRef) {}

  private readonly SCROLL_DELAY_MS = 100;

  shouldShowFilter(filter: DiscoverableFilter): boolean {
    if (!filter || !filter.key) return false;

    if (filter.key === 'resourceType' || filter.key === 'accessService') {
      return Boolean(filter.options && filter.options.length > 0);
    }

    return Boolean((filter.resultCount && filter.resultCount > 0) || (filter.options && filter.options.length > 0));
  }

  onAccordionToggle(filterKey: string | number | string[] | number[]): void {
    if (!filterKey) return;

    const key = Array.isArray(filterKey) ? filterKey[0]?.toString() : filterKey.toString();

    this.scrollPanelIntoView(key);

    const selectedFilter = this.filters().find((filter) => filter.key === key);

    if (selectedFilter) {
      this.expandedFilters.update((expanded) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(key)) {
          newExpanded.delete(key);
        } else {
          newExpanded.add(key);
        }
        return newExpanded;
      });

      if (!selectedFilter.options?.length) {
        this.loadFilterOptions.emit(selectedFilter);
      }
    }
  }

  onOptionChanged(filter: DiscoverableFilter, filterOption: FilterOption | null): void {
    this.filterOptionChanged.emit({ filter, filterOption });
  }

  private scrollPanelIntoView(key: string) {
    of(key)
      .pipe(delay(this.SCROLL_DELAY_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (key) => {
          const panelContent = this.el.nativeElement.querySelector(
            `p-accordion-panel[ng-reflect-value="${key}"] p-accordion-content`
          );

          const scrollContainer = document.querySelector('.filters-section');

          if (panelContent && scrollContainer) {
            const contentRect = panelContent.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const newScrollTop = scrollContainer.scrollTop + (contentRect.top - containerRect.top);

            scrollContainer.scrollTo({
              top: newScrollTop,
              behavior: 'smooth',
            });
          }
        },
      });
  }

  onFilterSearch(filter: DiscoverableFilter, searchText: string): void {
    if (filter) {
      this.filterSearchChanged.emit({ filter, searchText });
    }
  }

  onLoadMoreOptions(filter: DiscoverableFilter): void {
    this.loadMoreFilterOptions.emit(filter);
  }

  onIsPresentFilterToggle(filter: DiscoverableFilter, isChecked: boolean): void {
    const value = isChecked ? 'true' : null;
    const filterOption: FilterOption = {
      label: '',
      value: String(value),
      cardSearchResultCount: NaN,
    };
    this.filterOptionChanged.emit({ filter, filterOption });
  }

  onCheckboxChange(event: CheckboxChangeEvent, filter: DiscoverableFilter): void {
    const isChecked = event?.checked || false;
    this.onIsPresentFilterToggle(filter, isChecked);
  }
}
