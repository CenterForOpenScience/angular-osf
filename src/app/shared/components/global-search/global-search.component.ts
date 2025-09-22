import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { ResourceType } from '@shared/enums';
import { StringOrNull } from '@shared/helpers';
import { DiscoverableFilter, TabOption } from '@shared/models';
import {
  ClearFilterSearchResults,
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  ResetSearchState,
  SetResourceType,
  SetSearchText,
  SetSortBy,
  UpdateFilterValue,
} from '@shared/stores/global-search';

import { FilterChipsComponent } from '../filter-chips/filter-chips.component';
import { ReusableFilterComponent } from '../reusable-filter/reusable-filter.component';
import { SearchHelpTutorialComponent } from '../search-help-tutorial/search-help-tutorial.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { SearchResultsContainerComponent } from '../search-results-container/search-results-container.component';

@Component({
  selector: 'osf-global-search',
  imports: [
    FilterChipsComponent,
    SearchInputComponent,
    SearchResultsContainerComponent,
    TranslatePipe,
    ReusableFilterComponent,
    SearchHelpTutorialComponent,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private actions = createDispatchMap({
    fetchResources: FetchResources,
    getResourcesByLink: FetchResourcesByLink,
    setSortBy: SetSortBy,
    setSearchText: SetSearchText,
    setResourceType: SetResourceType,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    clearFilterSearchResults: ClearFilterSearchResults,
    updateFilterValue: UpdateFilterValue,
    resetSearchState: ResetSearchState,
  });

  resourceTabOptions = input<TabOption[]>([]);

  resources = select(GlobalSearchSelectors.getResources);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);
  resourcesCount = select(GlobalSearchSelectors.getResourcesCount);

  filters = select(GlobalSearchSelectors.getFilters);
  filterValues = select(GlobalSearchSelectors.getFilterValues);
  filterSearchCache = select(GlobalSearchSelectors.getFilterSearchCache);

  sortBy = select(GlobalSearchSelectors.getSortBy);
  first = select(GlobalSearchSelectors.getFirst);
  next = select(GlobalSearchSelectors.getNext);
  previous = select(GlobalSearchSelectors.getPrevious);
  resourceType = select(GlobalSearchSelectors.getResourceType);

  provider = input<PreprintProviderDetails | null>(null);
  searchControlInput = input<FormControl | null>(null);

  searchControl!: FormControl;
  currentStep = signal(0);

  ngOnInit(): void {
    this.searchControl = this.searchControlInput() ?? new FormControl('');

    this.restoreFiltersFromUrl();
    this.restoreTabFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();

    this.actions.fetchResources();
  }

  ngOnDestroy() {
    this.actions.resetSearchState();
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

  onFilterChanged(event: { filterType: string; value: StringOrNull }): void {
    this.actions.updateFilterValue(event.filterType, event.value);

    const currentFilters = this.filterValues();

    this.updateUrlWithFilters(currentFilters);
    this.actions.fetchResources();
  }

  onTabChange(resourceTab: ResourceType): void {
    this.actions.setResourceType(resourceTab);
    this.updateUrlWithTab(resourceTab);
    this.actions.fetchResources();
  }

  onSortChanged(sortBy: string): void {
    this.actions.setSortBy(sortBy);
    this.actions.fetchResources();
  }

  onPageChanged(link: string): void {
    this.actions.getResourcesByLink(link);
  }

  onFilterChipRemoved(filterKey: string): void {
    this.actions.updateFilterValue(filterKey, null);
    this.updateUrlWithFilters(this.filterValues());
    this.actions.fetchResources();
  }

  showTutorial() {
    this.currentStep.set(1);
  }

  private updateUrlWithFilters(filterValues: Record<string, StringOrNull>): void {
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

  private restoreFiltersFromUrl(): void {
    const queryParams = this.route.snapshot.queryParams;
    const filterValues: Record<string, StringOrNull> = {};

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

  private updateUrlWithTab(tab: ResourceType): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab !== ResourceType.Null ? tab : null },
      queryParamsHandling: 'merge',
    });
  }

  private restoreTabFromUrl(): void {
    const tab = this.route.snapshot.queryParams['tab'];
    if (tab !== undefined) {
      this.actions.setResourceType(+tab);
    }
  }

  private handleSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newValue) => {
          if (!newValue) newValue = null;
          this.actions.setSearchText(newValue);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: newValue },
            queryParamsHandling: 'merge',
          });
          this.actions.fetchResources();
        },
      });
  }

  private restoreSearchFromUrl(): void {
    const searchTerm = this.route.snapshot.queryParams['search'];

    if (searchTerm) {
      this.searchControl.setValue(searchTerm, { emitEvent: false });
      this.actions.setSearchText(searchTerm);
    }
  }
}
