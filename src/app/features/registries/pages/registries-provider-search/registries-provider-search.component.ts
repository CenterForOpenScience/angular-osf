import { createDispatchMap, select } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistryProviderHeroComponent } from '@osf/features/registries/components/registry-provider-hero/registry-provider-hero.component';
import {
  FetchResources,
  FetchResourcesByLink,
  GetRegistryProviderBrand,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  RegistriesProviderSearchSelectors,
  SetFilterValues,
  UpdateFilterValue,
  UpdateResourceType,
  UpdateSortBy,
} from '@osf/features/registries/store/registries-provider-search';
import {
  FilterChipsComponent,
  ReusableFilterComponent,
  SearchHelpTutorialComponent,
  SearchResultsContainerComponent,
} from '@shared/components';
import { SEARCH_TAB_OPTIONS } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { DiscoverableFilter } from '@shared/models';

@Component({
  selector: 'osf-registries-provider-search',
  imports: [
    RegistryProviderHeroComponent,
    FilterChipsComponent,
    ReusableFilterComponent,
    SearchHelpTutorialComponent,
    SearchResultsContainerComponent,
  ],
  templateUrl: './registries-provider-search.component.html',
  styleUrl: './registries-provider-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistriesProviderSearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly provider = select(RegistriesProviderSearchSelectors.getBrandedProvider);
  protected readonly isProviderLoading = select(RegistriesProviderSearchSelectors.isBrandedProviderLoading);
  protected readonly resources = select(RegistriesProviderSearchSelectors.getResources);
  protected readonly isResourcesLoading = select(RegistriesProviderSearchSelectors.getResourcesLoading);
  protected readonly resourcesCount = select(RegistriesProviderSearchSelectors.getResourcesCount);
  protected readonly resourceType = select(RegistriesProviderSearchSelectors.getResourceType);
  protected readonly filters = select(RegistriesProviderSearchSelectors.getFilters);
  protected readonly selectedValues = select(RegistriesProviderSearchSelectors.getFilterValues);
  protected readonly selectedSort = select(RegistriesProviderSearchSelectors.getSortBy);
  protected readonly first = select(RegistriesProviderSearchSelectors.getFirst);
  protected readonly next = select(RegistriesProviderSearchSelectors.getNext);
  protected readonly previous = select(RegistriesProviderSearchSelectors.getPrevious);

  searchControl = new FormControl('');

  private readonly actions = createDispatchMap({
    getProvider: GetRegistryProviderBrand,
    updateResourceType: UpdateResourceType,
    updateSortBy: UpdateSortBy,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    setFilterValues: SetFilterValues,
    updateFilterValue: UpdateFilterValue,
    fetchResourcesByLink: FetchResourcesByLink,
    fetchResources: FetchResources,
  });

  protected currentStep = signal(0);
  protected isFiltersOpen = signal(false);
  protected isSortingOpen = signal(false);

  private readonly tabUrlMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.value, option.label.split('.').pop()?.toLowerCase() || 'all'])
  );

  private readonly urlTabMap = new Map(
    SEARCH_TAB_OPTIONS.map((option) => [option.label.split('.').pop()?.toLowerCase() || 'all', option.value])
  );

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

  constructor() {
    this.restoreFiltersFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();

    this.route.params.subscribe((params) => {
      const name = params['name'];
      if (name) {
        this.actions.getProvider(name);
      }
    });
  }

  onSortChanged(sort: string): void {
    this.actions.updateSortBy(sort);
    this.actions.fetchResources();
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

  onLoadFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadFilterOptions(event.filterType);
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

  onPageChanged(link: string): void {
    this.actions.fetchResourcesByLink(link);
  }

  onFiltersToggled(): void {
    this.isFiltersOpen.update((open) => !open);
    this.isSortingOpen.set(false);
  }

  onSortingToggled(): void {
    this.isSortingOpen.update((open) => !open);
    this.isFiltersOpen.set(false);
  }

  showTutorial() {
    this.currentStep.set(1);
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
