import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { SafeHtmlPipe } from 'primeng/menu';
import { Tabs, TabsModule } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FilterChipsComponent,
  LoadingSpinnerComponent,
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
  FetchInstitutionById,
  FetchResources,
  FetchResourcesByLink,
  InstitutionsSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SetFilterValues,
  UpdateFilterValue,
  UpdateResourceType,
  UpdateSortBy,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-institutions-search',
  imports: [
    ReusableFilterComponent,
    SearchResultsContainerComponent,
    FilterChipsComponent,
    AutoCompleteModule,
    FormsModule,
    Tabs,
    TabsModule,
    SearchHelpTutorialComponent,
    SearchInputComponent,
    TranslatePipe,
    NgOptimizedImage,
    LoadingSpinnerComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './institutions-search.component.html',
  styleUrl: './institutions-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  institution = select(InstitutionsSearchSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsSearchSelectors.getInstitutionLoading);
  resources = select(InstitutionsSearchSelectors.getResources);
  isResourcesLoading = select(InstitutionsSearchSelectors.getResourcesLoading);
  resourcesCount = select(InstitutionsSearchSelectors.getResourcesCount);
  filters = select(InstitutionsSearchSelectors.getFilters);
  selectedValues = select(InstitutionsSearchSelectors.getFilterValues);
  selectedSort = select(InstitutionsSearchSelectors.getSortBy);
  first = select(InstitutionsSearchSelectors.getFirst);
  next = select(InstitutionsSearchSelectors.getNext);
  previous = select(InstitutionsSearchSelectors.getPrevious);
  filterSearchResults = select(InstitutionsSearchSelectors.getFilterSearchCache);

  private readonly actions = createDispatchMap({
    fetchInstitution: FetchInstitutionById,
    updateResourceType: UpdateResourceType,
    updateSortBy: UpdateSortBy,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    clearFilterSearchResults: ClearFilterSearchResults,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    setFilterValues: SetFilterValues,
    updateFilterValue: UpdateFilterValue,
    fetchResourcesByLink: FetchResourcesByLink,
    fetchResources: FetchResources,
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

  readonly resourceTab = ResourceTab;
  readonly resourceType = select(InstitutionsSearchSelectors.getResourceType);

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
    return options;
  });

  ngOnInit(): void {
    this.restoreFiltersFromUrl();
    this.restoreTabFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();

    const institutionId = this.route.snapshot.params['institution-id'];
    if (institutionId) {
      this.actions.fetchInstitution(institutionId);
    }
  }

  onLoadFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadFilterOptions(event.filterType);
  }

  onFilterSearchChanged(event: { filterType: string; searchText: string }): void {
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
    this.actions.fetchResources();
  }

  onSortChanged(sort: string): void {
    this.actions.updateSortBy(sort);
    this.actions.fetchResources();
  }

  onPageChanged(link: string): void {
    this.actions.fetchResourcesByLink(link);
  }

  onFilterChipRemoved(filterKey: string): void {
    this.actions.updateFilterValue(filterKey, null);

    const currentFilters = this.selectedValues();
    const updatedFilters = { ...currentFilters };
    delete updatedFilters[filterKey];
    this.updateUrlWithFilters(updatedFilters);

    this.actions.fetchResources();
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
    const queryParams = this.route.snapshot.queryParams;
    const filterValues: Record<string, string | null> = {};

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        const filterValue = queryParams[key];
        if (filterValue) {
          filterValues[filterKey] = filterValue;
        }
      }
    });

    if (Object.keys(filterValues).length > 0) {
      this.actions.loadFilterOptionsAndSetValues(filterValues);
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
