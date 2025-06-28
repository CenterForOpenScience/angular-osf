import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FILTER_PLACEHOLDERS } from '@shared/constants/filter-placeholders';
import { ReusableFilterType } from '@shared/enums';
import { DiscoverableFilter, SelectOption } from '@shared/models';

import { GenericFilterComponent } from '../generic-filter/generic-filter.component';

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
  ],
  templateUrl: './reusable-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableFilterComponent {
  filters = input<DiscoverableFilter[]>([]);
  selectedValues = input<Record<string, string | null>>({});

  loadFilterOptions = output<{ filterType: string; filter: DiscoverableFilter }>();
  filterValueChanged = output<{ filterType: string; value: string | null }>();

  readonly FILTER_PLACEHOLDERS = FILTER_PLACEHOLDERS;

  readonly hasFilters = computed(() => {
    const filterList = this.filters();
    return filterList.length > 0;
  });

  shouldShowFilter(filter: DiscoverableFilter): boolean {
    return (
      (filter.resultCount && filter.resultCount > 0) ||
      (filter.options && filter.options.length > 0) ||
      filter.hasOptions === true
    );
  }

  onAccordionToggle(filterKey: string | number | string[] | number[]): void {
    if (filterKey) {
      const selectedFilter = this.filters().find((value) => value.key === filterKey);
      if (selectedFilter) {
        this.loadFilterOptions.emit({
          filterType: filterKey as ReusableFilterType,
          filter: selectedFilter,
        });
      }
    }
  }

  onFilterChanged(filterType: string, value: string | null): void {
    this.filterValueChanged.emit({ filterType, value });
  }

  getFilterOptions(filter: DiscoverableFilter): SelectOption[] {
    return filter.options || [];
  }

  isFilterLoading(filter: DiscoverableFilter): boolean {
    return filter.isLoading || false;
  }

  getSelectedValue(filterKey: string): string | null {
    return this.selectedValues()[filterKey] || null;
  }

  getFilterPlaceholder(filterKey: string): string {
    return this.FILTER_PLACEHOLDERS[filterKey]?.placeholder || '';
  }

  isFilterEditable(filterKey: string): boolean {
    return this.FILTER_PLACEHOLDERS[filterKey]?.editable || false;
  }
}
