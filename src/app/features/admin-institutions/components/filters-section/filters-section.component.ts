import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, model } from '@angular/core';

import { FilterChipsComponent, ReusableFilterComponent } from '@shared/components';
import { StringOrNull } from '@shared/helpers';
import { DiscoverableFilter } from '@shared/models';
import {
  ClearFilterSearchResults,
  FetchResources,
  GlobalSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SetDefaultFilterValue,
  UpdateFilterValue,
} from '@shared/stores/global-search';

@Component({
  selector: 'osf-institution-resource-table-filters',
  imports: [Button, Card, FilterChipsComponent, TranslatePipe, ReusableFilterComponent],
  templateUrl: './filters-section.component.html',
  styleUrl: './filters-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersSectionComponent {
  private actions = createDispatchMap({
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    updateFilterValue: UpdateFilterValue,
    clearFilterSearchResults: ClearFilterSearchResults,
    setDefaultFilterValue: SetDefaultFilterValue,
    fetchResources: FetchResources,
  });

  filtersVisible = model<boolean>();
  filters = select(GlobalSearchSelectors.getFilters);
  filterValues = select(GlobalSearchSelectors.getFilterValues);
  filterSearchCache = select(GlobalSearchSelectors.getFilterSearchCache);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);

  onFilterChanged(event: { filterType: string; value: StringOrNull }): void {
    this.actions.updateFilterValue(event.filterType, event.value);
    this.actions.fetchResources();
  }

  onLoadFilterOptions(filter: DiscoverableFilter): void {
    this.actions.loadFilterOptions(filter.key);
  }

  onLoadMoreFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadMoreFilterOptions(event.filterType);
  }

  onFilterSearchChanged(event: { filterType: string; searchText: string; filter: DiscoverableFilter }): void {
    if (event.searchText.trim()) {
      this.actions.loadFilterOptionsWithSearch(event.filterType, event.searchText);
    } else {
      this.actions.clearFilterSearchResults(event.filterType);
    }
  }

  onFilterChipRemoved(filterKey: string): void {
    this.actions.updateFilterValue(filterKey, null);
    this.actions.fetchResources();
  }
}
