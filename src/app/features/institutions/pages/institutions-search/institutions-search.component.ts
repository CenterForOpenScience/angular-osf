import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { SafeHtmlPipe } from 'primeng/menu';
import { TabsModule } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
  UpdateFilterValue,
  UpdateResourceType,
  UpdateSortBy,
} from '@osf/shared/stores';
import { StringOrNull } from '@shared/helpers';

@Component({
  selector: 'osf-institutions-search',
  imports: [
    ReusableFilterComponent,
    SearchResultsContainerComponent,
    FilterChipsComponent,
    AutoCompleteModule,
    FormsModule,
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private actions = createDispatchMap({
    fetchInstitution: FetchInstitutionById,
    updateResourceType: UpdateResourceType,
    updateSortBy: UpdateSortBy,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    clearFilterSearchResults: ClearFilterSearchResults,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    updateFilterValue: UpdateFilterValue,
    fetchResourcesByLink: FetchResourcesByLink,
    fetchResources: FetchResources,
  });

  private readonly tabUrlMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.value, option.label.split('.').pop()?.toLowerCase() || 'all'])
  );

  private readonly urlTabMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.label.split('.').pop()?.toLowerCase() || 'all', option.value])
  );

  institution = select(InstitutionsSearchSelectors.getInstitution);
  isInstitutionLoading = select(InstitutionsSearchSelectors.getInstitutionLoading);

  resources = select(InstitutionsSearchSelectors.getResources);
  areResourcesLoading = select(InstitutionsSearchSelectors.getResourcesLoading);
  resourcesCount = select(InstitutionsSearchSelectors.getResourcesCount);

  filters = select(InstitutionsSearchSelectors.getFilters);
  filterValues = select(InstitutionsSearchSelectors.getFilterValues);
  filterSearchCache = select(InstitutionsSearchSelectors.getFilterSearchCache);

  sortBy = select(InstitutionsSearchSelectors.getSortBy);
  first = select(InstitutionsSearchSelectors.getFirst);
  next = select(InstitutionsSearchSelectors.getNext);
  previous = select(InstitutionsSearchSelectors.getPrevious);
  resourceType = select(InstitutionsSearchSelectors.getResourceType);

  readonly resourceTabOptions = SEARCH_TAB_OPTIONS;

  searchControl = new FormControl('');
  currentStep = signal(0);

  ngOnInit(): void {
    this.restoreFiltersFromUrl();
    this.restoreTabFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();

    const institutionId = this.route.snapshot.params['institution-id'];
    if (institutionId) {
      this.actions.fetchInstitution(institutionId).subscribe({
        next: () => {
          this.actions.fetchResources();
        },
      });
    }
  }

  onLoadFilterOptions(filter: DiscoverableFilter): void {
    this.actions.loadFilterOptions(filter.key);
  }

  onLoadMoreFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadMoreFilterOptions(event.filterType);
  }

  onFilterSearchChanged(event: { filterType: string; searchText: string }): void {
    if (event.searchText.trim()) {
      this.actions.loadFilterOptionsWithSearch(event.filterType, event.searchText);
    } else {
      this.actions.clearFilterSearchResults(event.filterType);
    }
  }

  onFilterChanged(event: { filterType: string; value: StringOrNull }): void {
    this.actions.updateFilterValue(event.filterType, event.value);
    this.updateUrlWithFilters(this.filterValues());
    this.actions.fetchResources();
  }

  onTabChange(resourceTab: ResourceTab): void {
    this.actions.updateResourceType(resourceTab);
    this.updateUrlWithTab(resourceTab);
    this.actions.fetchResources();
  }

  onSortChanged(sortBy: string): void {
    this.actions.updateSortBy(sortBy);
    this.actions.fetchResources();
  }

  onPageChanged(link: string): void {
    this.actions.fetchResourcesByLink(link);
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
    const tabString = this.route.snapshot.queryParams['tab'];

    if (tabString) {
      const tab = this.urlTabMap.get(tabString);
      if (tab !== undefined) {
        this.actions.updateResourceType(tab);
      }
    }
  }

  private handleSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newValue) => {
          if (!newValue) newValue = null;
          this.actions.updateFilterValue('search', newValue);
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
      this.actions.updateFilterValue('search', searchTerm);
    }
  }
}
