import { createDispatchMap, select } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { StringOrNull } from '@shared/helpers';
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
export class RegistriesProviderSearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private actions = createDispatchMap({
    getProvider: GetRegistryProviderBrand,
    updateResourceType: UpdateResourceType,
    updateSortBy: UpdateSortBy,
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    updateFilterValue: UpdateFilterValue,
    fetchResourcesByLink: FetchResourcesByLink,
    fetchResources: FetchResources,
  });

  provider = select(RegistriesProviderSearchSelectors.getBrandedProvider);
  isProviderLoading = select(RegistriesProviderSearchSelectors.isBrandedProviderLoading);

  resources = select(RegistriesProviderSearchSelectors.getResources);
  areResourcesLoading = select(RegistriesProviderSearchSelectors.getResourcesLoading);
  resourcesCount = select(RegistriesProviderSearchSelectors.getResourcesCount);

  filters = select(RegistriesProviderSearchSelectors.getFilters);
  filterValues = select(RegistriesProviderSearchSelectors.getFilterValues);

  sortBy = select(RegistriesProviderSearchSelectors.getSortBy);
  first = select(RegistriesProviderSearchSelectors.getFirst);
  next = select(RegistriesProviderSearchSelectors.getNext);
  previous = select(RegistriesProviderSearchSelectors.getPrevious);
  resourceType = select(RegistriesProviderSearchSelectors.getResourceType);

  searchControl = new FormControl('');
  currentStep = signal(0);

  ngOnInit(): void {
    this.restoreFiltersFromUrl();
    this.restoreSearchFromUrl();
    this.handleSearch();

    const providerName = this.route.snapshot.params['name'];
    if (providerName) {
      this.actions.getProvider(providerName).subscribe({
        next: () => {
          this.actions.fetchResources();
        },
      });
    }
  }

  onLoadFilterOptions(filter: DiscoverableFilter): void {
    this.actions.loadFilterOptions(filter.key);
  }

  onFilterChanged(event: { filterType: string; value: StringOrNull }): void {
    this.actions.updateFilterValue(event.filterType, event.value);
    this.updateUrlWithFilters(this.filterValues());
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
