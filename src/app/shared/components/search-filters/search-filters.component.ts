import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';

import { delay, of } from 'rxjs';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FILTER_PLACEHOLDERS } from '@osf/shared/constants';
import { DiscoverableFilter, FilterOperator, FilterOption } from '@osf/shared/models';

import { GenericFilterComponent } from '../generic-filter/generic-filter.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-search-filters',
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
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersComponent {
  filters = input<DiscoverableFilter[]>([]);
  selectedOptions = input<Record<string, FilterOption[]>>({});
  filterSearchResults = input<Record<string, FilterOption[]>>({});
  isLoading = input<boolean>(false);
  showEmptyState = input<boolean>(true);
  plainStyle = input<boolean>(false);

  loadFilterOptions = output<DiscoverableFilter>();
  loadMoreFilterOptions = output<DiscoverableFilter>();

  filterOptionSelected = output<{ filter: DiscoverableFilter; filterOption: FilterOption[] }>();
  filterOptionsSearch = output<{ filter: DiscoverableFilter; searchText: string }>();

  readonly String = String;
  readonly Boolean = Boolean;
  readonly FILTER_PLACEHOLDERS = FILTER_PLACEHOLDERS;

  private destroyRef = inject(DestroyRef);
  private readonly SCROLL_DELAY_MS = 300;

  selectedOptionValues = computed(() =>
    Object.fromEntries(
      Object.entries(this.selectedOptions()).map(([key, value]) => [
        key,
        value.map((option) => option.value).filter(Boolean)[0],
      ])
    )
  );

  readonly visibleFilters = computed(() => {
    return this.filters().filter((filter) => {
      if (!filter || !filter.key) return false;

      return Boolean((filter.resultCount && filter.resultCount > 0) || (filter.options && filter.options.length > 0));
    });
  });

  readonly splitFilters = computed(() => {
    const filters = this.visibleFilters();
    const individualFilters: DiscoverableFilter[] = [];
    const groupedFilters: DiscoverableFilter[] = [];

    filters.forEach((filter) => {
      if (filter.operator === FilterOperator.IsPresent) {
        groupedFilters.push(filter);
      } else {
        individualFilters.push(filter);
      }
    });

    return {
      individual: individualFilters,
      grouped: groupedFilters.sort((a, b) => b.resultCount! - a.resultCount!),
    };
  });

  onAccordionToggle(filterKey: string): void {
    this.scrollPanelIntoView(filterKey);

    const selectedFilter = this.filters().find((filter) => filter.key === filterKey);
    if (!selectedFilter) return;
    this.loadFilterOptions.emit(selectedFilter);
  }

  onSelectedFilterOptionsChanged(filter: DiscoverableFilter, payload: FilterOption[]): void {
    this.filterOptionSelected.emit({ filter, filterOption: payload });
  }

  onSearchFilterOptions(filter: DiscoverableFilter, searchText: string): void {
    this.filterOptionsSearch.emit({ filter, searchText });
  }

  onLoadMoreFilterOptions(filter: DiscoverableFilter): void {
    this.loadMoreFilterOptions.emit(filter);
  }

  onCheckboxChange(event: CheckboxChangeEvent, filter: DiscoverableFilter): void {
    const isChecked = event?.checked || false;
    const option: FilterOption = {
      label: '',
      value: 'true',
      cardSearchResultCount: NaN,
    };
    this.filterOptionSelected.emit({ filter, filterOption: isChecked ? [option] : [] });
  }

  private scrollPanelIntoView(key: string) {
    of(key)
      .pipe(delay(this.SCROLL_DELAY_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (key) => {
          const panelContent = document.getElementById(`filter-${key}`);
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
}
