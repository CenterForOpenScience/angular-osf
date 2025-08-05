import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Tabs, TabsModule } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FilterChipsComponent,
  ReusableFilterComponent,
  SearchHelpTutorialComponent,
  SearchInputComponent,
  SearchResultsContainerComponent,
} from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceTab } from '@osf/shared/enums';
import { DiscoverableFilter } from '@osf/shared/models';

import {
  ClearFilterSearchResults,
  GetResources,
  GetResourcesByLink,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SearchSelectors,
  SetFilterOptionsFromUrl,
  SetFilterValues,
  SetResourceTab,
  SetSortBy,
  UpdateFilterValue,
} from './store';

@Component({
  selector: 'osf-search',
  imports: [
    ReusableFilterComponent,
    SearchResultsContainerComponent,
    FilterChipsComponent,
    FormsModule,
    Tabs,
    TabsModule,
    SearchHelpTutorialComponent,
    SearchInputComponent,
    TranslatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  resources = select(SearchSelectors.getResources);
  isResourcesLoading = select(SearchSelectors.getResourcesLoading);
  resourcesCount = select(SearchSelectors.getResourcesCount);
  filters = select(SearchSelectors.getFilters);
  selectedValues = select(SearchSelectors.getFilterValues);
  filterSearchResults = select(SearchSelectors.getFilterSearchCache);
  filterOptionsCache = select(SearchSelectors.getFilterOptionsCache);
  selectedSort = select(SearchSelectors.getSortBy);
  first = select(SearchSelectors.getFirst);
  next = select(SearchSelectors.getNext);
  previous = select(SearchSelectors.getPrevious);

  private readonly actions = createDispatchMap({
    updateResourceType: SetResourceTab,
    updateSortBy: SetSortBy,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    clearFilterSearchResults: ClearFilterSearchResults,
    setFilterValues: SetFilterValues,
    setFilterOptionsFromUrl: SetFilterOptionsFromUrl,
    updateFilterValue: UpdateFilterValue,
    getResourcesByLink: GetResourcesByLink,
    getResources: GetResources,
  });

  protected readonly resourceTabOptions = SEARCH_TAB_OPTIONS;

  private readonly tabUrlMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.value, option.label.split('.').pop()?.toLowerCase() || 'all'])
  );

  private readonly urlTabMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.label.split('.').pop()?.toLowerCase() || 'all', option.value])
  );

  protected searchControl = new FormControl('');
  protected selectedTab: ResourceTab = ResourceTab.All;
  protected currentStep = signal(0);
  protected isFiltersOpen = signal(true);
  protected isSortingOpen = signal(false);

  readonly resourceTab = ResourceTab;
  readonly resourceType = select(SearchSelectors.getResourceTab);

  readonly filterLabels = computed(() => {
    const filtersData = this.filters();
    const labels: Record<string, string> = {};
    filtersData.forEach((filter) => {
      if (filter.key && filter.label) {
        labels[filter.key] = filter.label;
      }
    });
    return labels;
  });

  readonly filterOptions = computed(() => {
    const filtersData = this.filters();
    const cachedOptions = this.filterOptionsCache();
    const options: Record<string, { id: string; value: string; label: string }[]> = {};

    filtersData.forEach((filter) => {
      if (filter.key && filter.options) {
        options[filter.key] = filter.options.map((opt) => ({
          id: String(opt.value || ''),
          value: String(opt.value || ''),
          label: opt.label,
        }));
      }
    });

    Object.entries(cachedOptions).forEach(([filterKey, cachedOpts]) => {
      if (cachedOpts && cachedOpts.length > 0) {
        const existingOptions = options[filterKey] || [];
        const existingValues = new Set(existingOptions.map((opt) => opt.value));

        const newCachedOptions = cachedOpts
          .filter((opt) => !existingValues.has(String(opt.value || '')))
          .map((opt) => ({
            id: String(opt.value || ''),
            value: String(opt.value || ''),
            label: opt.label,
          }));

        options[filterKey] = [...newCachedOptions, ...existingOptions];
      }
    });

    return options;
  });

  ngOnInit(): void {
    this.restoreFiltersFromUrl();
    this.restoreTabFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();
  }

  onLoadFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadFilterOptions(event.filterType);
  }

  onFilterSearchChanged(event: { filterType: string; searchText: string; filter: DiscoverableFilter }): void {
    if (event.searchText.trim()) {
      this.actions.loadFilterOptionsWithSearch(event.filterType, event.searchText);
    } else {
      this.actions.clearFilterSearchResults(event.filterType);
    }
  }

  onLoadMoreFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadMoreFilterOptions(event.filterType);
  }

  onFilterChanged(event: { filterType: string; value: string | null }): void {
    this.actions.updateFilterValue(event.filterType, event.value);

    const currentFilters = this.selectedValues();
    const updatedFilters = {
      ...currentFilters,
      [event.filterType]: event.value,
    };

    Object.keys(updatedFilters).forEach((key) => {
      if (!updatedFilters[key]) {
        delete updatedFilters[key];
      }
    });

    this.updateUrlWithFilters(updatedFilters);
  }

  showTutorial() {
    this.currentStep.set(1);
  }

  onTabChange(index: ResourceTab): void {
    this.selectedTab = index;
    this.actions.updateResourceType(index);
    this.updateUrlWithTab(index);
    this.actions.getResources();
  }

  onSortChanged(sort: string): void {
    this.actions.updateSortBy(sort);
    this.actions.getResources();
  }

  onPageChanged(link: string): void {
    this.actions.getResourcesByLink(link);
  }

  onFiltersToggled(): void {
    this.isFiltersOpen.update((open) => !open);
    this.isSortingOpen.set(false);
  }

  onSortingToggled(): void {
    this.isSortingOpen.update((open) => !open);
    this.isFiltersOpen.set(false);
  }

  onFilterChipRemoved(filterKey: string): void {
    this.actions.updateFilterValue(filterKey, null);

    const currentFilters = this.selectedValues();
    const updatedFilters = { ...currentFilters };
    delete updatedFilters[filterKey];
    this.updateUrlWithFilters(updatedFilters);

    this.actions.getResources();
  }

  onAllFiltersCleared(): void {
    this.actions.setFilterValues({});

    this.searchControl.setValue('', { emitEvent: false });
    this.actions.updateFilterValue('search', '');

    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        delete queryParams[key];
      }
    });

    delete queryParams['search'];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  private restoreFiltersFromUrl(): void {
    const filterValues: Record<string, string | null> = {};
    const filterLabels: Record<string, { value: string; label: string }> = {};

    const urlParams = new URLSearchParams(window.location.search);

    const activeFiltersParam = urlParams.get('activeFilters');
    if (activeFiltersParam) {
      const activeFilters = JSON.parse(decodeURIComponent(activeFiltersParam));
      if (Array.isArray(activeFilters)) {
        activeFilters.forEach((filter: { filterName?: string; label?: string; value?: string }) => {
          if (filter.filterName && filter.value) {
            const filterKey = filter.filterName.toLowerCase();
            filterValues[filterKey] = filter.value;

            if (filter.label) {
              filterLabels[filterKey] = { value: filter.value, label: filter.label };
            }
          }
        });
      }
    }

    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        filterValues[filterKey] = value;
      }
    }

    if (Object.keys(filterValues).length > 0) {
      this.prePopulateFilterLabels(filterLabels);

      this.actions.setFilterValues(filterValues);

      this.actions.loadFilterOptionsAndSetValues(filterValues);

      this.actions.getResources();
    } else {
      this.actions.getResources();
    }
  }

  private prePopulateFilterLabels(filterLabels: Record<string, { value: string; label: string }>): void {
    if (Object.keys(filterLabels).length > 0) {
      const filterOptions: Record<string, { value: string; label: string }[]> = {};

      Object.entries(filterLabels).forEach(([filterKey, { value, label }]) => {
        filterOptions[filterKey] = [{ value, label }];
      });

      this.actions.setFilterOptionsFromUrl(filterOptions);
    }
  }

  private updateUrlWithFilters(filterValues: Record<string, string | null>): void {
    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        delete queryParams[key];
      }
    });

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams[`filter_${key}`] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  private updateUrlWithTab(tab: ResourceTab): void {
    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };

    if (tab !== ResourceTab.All) {
      queryParams['tab'] = this.tabUrlMap.get(tab) || 'all';
    } else {
      delete queryParams['tab'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  private restoreTabFromUrl(): void {
    const queryParams = this.route.snapshot.queryParams;

    const resourceTabParam = queryParams['resourceTab'];
    if (resourceTabParam !== undefined) {
      const tabValue = parseInt(resourceTabParam, 10);
      if (!isNaN(tabValue) && tabValue >= 0 && tabValue <= 6) {
        this.selectedTab = tabValue as ResourceTab;
        this.actions.updateResourceType(tabValue as ResourceTab);
        return;
      }
    }

    const tabString = queryParams['tab'];
    if (tabString) {
      const tab = this.urlTabMap.get(tabString);
      if (tab !== undefined) {
        this.selectedTab = tab;
        this.actions.updateResourceType(tab);
      }
    }
  }

  private restoreSearchFromUrl(): void {
    const queryParams = this.route.snapshot.queryParams;
    const searchTerm = queryParams['search'];
    if (searchTerm) {
      this.searchControl.setValue(searchTerm, { emitEvent: false });
      this.actions.updateFilterValue('search', searchTerm);
    }
  }

  private handleSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newValue) => {
          this.actions.updateFilterValue('search', newValue);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: newValue },
            queryParamsHandling: 'merge',
          });
        },
      });
  }
}
