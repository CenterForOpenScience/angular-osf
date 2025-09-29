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
import { DiscoverableFilter, FilterOption, TabOption } from '@shared/models';
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
  UpdateSelectedFilterOption,
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
    updateSelectedFilterOption: UpdateSelectedFilterOption,
    resetSearchState: ResetSearchState,
  });

  resourceTabOptions = input<TabOption[]>([]);

  resources = select(GlobalSearchSelectors.getResources);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);
  resourcesCount = select(GlobalSearchSelectors.getResourcesCount);

  filters = select(GlobalSearchSelectors.getFilters);
  filterOptions = select(GlobalSearchSelectors.getSelectedOptions);
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

    this.restoreTabFromUrl();
    this.restoreFiltersFromUrl();
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

  onLoadMoreFilterOptions(filter: DiscoverableFilter): void {
    this.actions.loadMoreFilterOptions(filter.key);
  }

  onFilterSearchChanged(event: { searchText: string; filter: DiscoverableFilter }): void {
    if (event.searchText.trim()) {
      this.actions.loadFilterOptionsWithSearch(event.filter.key, event.searchText);
    } else {
      this.actions.clearFilterSearchResults(event.filter.key);
    }
  }

  onFilterOptionChanged(event: { filter: DiscoverableFilter; filterOption: FilterOption | null }): void {
    this.actions.updateSelectedFilterOption(event.filter.key, event.filterOption);

    const currentFilters = this.filterOptions();

    this.updateUrlWithFilterOptions(currentFilters);
    this.actions.fetchResources();
  }

  onTabChange(resourceTab: ResourceType): void {
    this.actions.setResourceType(resourceTab);
    this.updateUrlWithTab(resourceTab);

    this.actions.fetchResources().subscribe({
      next: () => {
        this.updateUrlWithFilterOptions(this.filterOptions());
      },
    });
  }

  onSortChanged(sortBy: string): void {
    this.actions.setSortBy(sortBy);
    this.actions.fetchResources();
  }

  onPageChanged(link: string): void {
    this.actions.getResourcesByLink(link).subscribe({
      next: () => {
        this.scrollToTop();
      },
    });
  }

  scrollToTop() {
    const contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;

    if (contentWrapper) {
      contentWrapper.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  onSelectedOptionRemoved(filterKey: string): void {
    this.actions.updateSelectedFilterOption(filterKey, null);
    this.updateUrlWithFilterOptions(this.filterOptions());
    this.actions.fetchResources();
  }

  showTutorial() {
    this.currentStep.set(1);
  }

  private updateUrlWithFilterOptions(filterValues: Record<string, FilterOption | null>) {
    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        delete queryParams[key];
      }
    });

    Object.entries(filterValues).forEach(([key, option]) => {
      if (option !== null) {
        queryParams[`filter_${key}`] = JSON.stringify(option);
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...queryParams },
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  private restoreFiltersFromUrl(): void {
    const queryParams = this.route.snapshot.queryParams;
    const filterValues: Record<string, FilterOption> = {};

    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        const filterValue = queryParams[key];
        if (filterValue) {
          filterValues[filterKey] = JSON.parse(filterValue) as FilterOption;
        }
      }
    });

    if (Object.keys(filterValues).length > 0) {
      this.actions.loadFilterOptionsAndSetValues(filterValues);
    }
  }

  private updateUrlWithTab(tab: ResourceType) {
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
