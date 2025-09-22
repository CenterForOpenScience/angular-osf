import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FILTER_PLACEHOLDERS } from '@osf/shared/constants';
import { StringOrNull } from '@osf/shared/helpers';
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
  selectedValues = input<Record<string, StringOrNull>>({});
  filterSearchResults = input<Record<string, FilterOption[]>>({});
  isLoading = input<boolean>(false);
  showEmptyState = input<boolean>(true);
  plainStyle = input<boolean>(false);

  readonly Boolean = Boolean;

  loadFilterOptions = output<DiscoverableFilter>();
  filterValueChanged = output<{ filterType: string; value: StringOrNull }>();
  filterSearchChanged = output<{ filterType: string; searchText: string; filter: DiscoverableFilter }>();
  loadMoreFilterOptions = output<{ filterType: string; filter: DiscoverableFilter }>();

  private readonly expandedFilters = signal<Set<string>>(new Set());

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

  shouldShowFilter(filter: DiscoverableFilter): boolean {
    if (!filter || !filter.key) return false;

    if (filter.key === 'resourceType' || filter.key === 'accessService') {
      return Boolean(filter.options && filter.options.length > 0);
    }

    return Boolean(
      (filter.resultCount && filter.resultCount > 0) ||
        (filter.options && filter.options.length > 0) ||
        filter.hasOptions ||
        (filter.selectedValues && filter.selectedValues.length > 0)
    );
  }

  onAccordionToggle(filterKey: string | number | string[] | number[]): void {
    if (!filterKey) return;

    const key = Array.isArray(filterKey) ? filterKey[0]?.toString() : filterKey.toString();
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

  onFilterChanged(filterType: string, value: string | null): void {
    this.filterValueChanged.emit({ filterType, value });
  }

  onFilterSearch(filterType: string, searchText: string): void {
    const filter = this.filters().find((f) => f.key === filterType);
    if (filter) {
      this.filterSearchChanged.emit({ filterType, searchText, filter });
    }
  }

  onLoadMoreOptions(filterType: string): void {
    const filter = this.filters().find((f) => f.key === filterType);
    if (filter) {
      this.loadMoreFilterOptions.emit({ filterType, filter });
    }
  }

  isFilterLoading(filter: DiscoverableFilter): boolean {
    return filter.isLoading || false;
  }

  getSelectedValue(filterKey: string): string | null {
    return this.selectedValues()[filterKey] || null;
  }

  getFilterPlaceholder(filterKey: string): string {
    return this.FILTER_PLACEHOLDERS[filterKey] || '';
  }

  getFilterLabel(filter: DiscoverableFilter): string {
    return filter.label || filter.key || '';
  }

  hasFilterContent(filter: DiscoverableFilter): boolean {
    return !!(
      filter.description ||
      filter.helpLink ||
      filter.resultCount ||
      filter.options?.length ||
      filter.hasOptions ||
      filter.type === 'group'
    );
  }

  onIsPresentFilterToggle(filter: DiscoverableFilter, isChecked: boolean): void {
    const value = isChecked ? 'true' : null;
    this.filterValueChanged.emit({ filterType: filter.key, value });
  }

  onCheckboxChange(event: CheckboxChangeEvent, filter: DiscoverableFilter): void {
    const isChecked = event?.checked || false;
    this.onIsPresentFilterToggle(filter, isChecked);
  }
}
