import { TranslatePipe } from '@ngx-translate/core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from '@shared/components';
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
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './reusable-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableFilterComponent {
  filters = input<DiscoverableFilter[]>([]);
  selectedValues = input<Record<string, string | null>>({});
  isLoading = input<boolean>(false);
  showEmptyState = input<boolean>(true);

  loadFilterOptions = output<{ filterType: string; filter: DiscoverableFilter }>();
  filterValueChanged = output<{ filterType: string; value: string | null }>();

  private readonly expandedFilters = signal<Set<string>>(new Set());

  readonly FILTER_PLACEHOLDERS = FILTER_PLACEHOLDERS;

  readonly hasFilters = computed(() => {
    const filterList = this.filters();
    return filterList && filterList.length > 0;
  });

  readonly visibleFilters = computed(() => {
    return this.filters().filter((filter) => this.shouldShowFilter(filter));
  });

  readonly hasVisibleFilters = computed(() => {
    return this.visibleFilters().length > 0;
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

      if (!selectedFilter.options?.length && selectedFilter.hasOptions) {
        this.loadFilterOptions.emit({
          filterType: key as ReusableFilterType,
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
    return this.FILTER_PLACEHOLDERS[filterKey] || '';
  }

  getFilterDescription(filter: DiscoverableFilter): string | null {
    return filter.description || null;
  }

  getFilterHelpLink(filter: DiscoverableFilter): string | null {
    return filter.helpLink || null;
  }

  getFilterHelpLinkText(filter: DiscoverableFilter): string | null {
    return filter.helpLinkText || '';
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
      filter.hasOptions
    );
  }
}
