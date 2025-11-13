import { createDispatchMap, select } from '@ngxs/store';

import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { collectionsSortOptions } from '@osf/features/collections/constants';
import { queryParamsKeys } from '@osf/features/collections/constants/query-params-keys.const';
import { CollectionQueryParams } from '@osf/features/collections/models';
import { CollectionsFilters } from '@osf/shared/models/collections/collections-filters.model';
import { CollectionsSelectors, SetAllFilters, SetSearchValue, SetSortBy } from '@shared/stores/collections';
import { SetPageNumber } from '@shared/stores/collections/collections.actions';

@Injectable()
export class CollectionsQuerySyncService {
  private readonly Sentry = inject(SENTRY_TOKEN);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly queryParams = toSignal(this.route.queryParams);
  private readonly isInitialized = signal(false);
  private readonly pendingFilters = signal<CollectionsFilters | null>(null);
  private readonly pendingSort = signal<string | null>(null);

  private readonly filtersOptions = select(CollectionsSelectors.getAllFiltersOptions);

  private readonly actions = createDispatchMap({
    setSortBy: SetSortBy,
    setSearchValue: SetSearchValue,
    setAllFilters: SetAllFilters,
    setPageNumber: SetPageNumber,
  });

  constructor() {
    this.setupFilterValidationEffect();
    this.setupSortValidationEffect();
  }

  initializeFromUrl(): void {
    this.initializeSearchAndSort();
    this.initializeFilters();
    this.isInitialized.set(true);
  }

  syncStoreToUrl(searchText: string, sortBy: string, selectedFilters: CollectionsFilters, page: string): void {
    if (!this.isInitialized() || this.pendingFilters()) return;

    const updates = this.calculateUrlUpdates(searchText, sortBy, selectedFilters, page);
    if (this.hasUrlUpdates(updates)) {
      this.updateUrlQueryParams(updates);
    }
  }

  private setupFilterValidationEffect(): void {
    effect(() => {
      const options = this.filtersOptions();
      const pending = this.pendingFilters();

      if (pending && this.hasAvailableFilterOptions(options)) {
        this.validateAndApplyPendingFilters(pending, options);
      }
    });
  }

  private setupSortValidationEffect(): void {
    effect(() => {
      const pending = this.pendingSort();

      if (pending !== null && this.isInitialized()) {
        this.validateAndApplyPendingSort(pending);
      }
    });
  }

  private initializeSearchAndSort(): void {
    const params = this.queryParams();
    if (!params) return;

    if (params['search'] || params['q']) {
      this.actions.setSearchValue(params['search'] || params['q']);
    }

    if (params['sort']) {
      this.handleSortFromUrl(params['sort']);
    }

    if (params['page']) {
      this.actions.setPageNumber(params['page'].toString());
    }
  }

  private handleSortFromUrl(sortValue: string): void {
    if (this.isValidSortValue(sortValue)) {
      this.actions.setSortBy(sortValue);
    } else {
      this.pendingSort.set(sortValue);
    }
  }

  private validateAndApplyPendingSort(sortValue: string): void {
    if (this.isValidSortValue(sortValue)) {
      this.actions.setSortBy(sortValue);
    } else {
      this.actions.setSortBy(collectionsSortOptions[0].value);
    }
    this.pendingSort.set(null);
  }

  private isValidSortValue(sortValue: string): boolean {
    return collectionsSortOptions.some((option) => option.value === sortValue);
  }

  private initializeFilters(): void {
    const params = this.queryParams();
    const activeFilters = params?.['activeFilters'];

    if (!activeFilters) return;

    try {
      const parsedFilters: CollectionsFilters = JSON.parse(activeFilters);
      this.handleParsedFilters(parsedFilters);
    } catch (error) {
      this.Sentry.captureException(error);
    }
  }

  private handleParsedFilters(filters: CollectionsFilters): void {
    const options = this.filtersOptions();

    if (this.hasAvailableFilterOptions(options)) {
      this.validateAndApplyFiltersImmediately(filters, options);
    } else {
      this.pendingFilters.set(filters);
    }
  }

  private validateAndApplyPendingFilters(filters: CollectionsFilters, options: CollectionsFilters): void {
    const validatedFilters = this.validateFilters(filters, options);
    const selectedFilters = this.getSelectedFilters(validatedFilters);

    if (Object.keys(selectedFilters).length) {
      this.actions.setAllFilters(selectedFilters);
    }

    this.pendingFilters.set(null);
  }

  private validateAndApplyFiltersImmediately(filters: CollectionsFilters, options: CollectionsFilters): void {
    const validatedFilters = this.validateFilters(filters, options);
    const selectedFilters = this.getSelectedFilters(validatedFilters);

    if (Object.keys(selectedFilters).length) {
      this.actions.setAllFilters(selectedFilters);
    }
  }

  private validateFilters(filters: CollectionsFilters, availableOptions: CollectionsFilters): CollectionsFilters {
    const validatedFilters: Partial<CollectionsFilters> = {};

    Object.keys(filters).forEach((filterKey) => {
      const key = filterKey as keyof CollectionsFilters;
      const filterValues = filters[key];
      const availableValues = availableOptions[key];

      if (this.isValidFilterArray(filterValues, availableValues)) {
        const validValues = this.getValidFilterValues(filterValues, availableValues);
        if (validValues.length) {
          validatedFilters[key] = validValues;
        }
      }
    });

    return validatedFilters as CollectionsFilters;
  }

  private calculateUrlUpdates(
    searchText: string,
    sortBy: string,
    selectedFilters: CollectionsFilters,
    page: string
  ): Partial<CollectionQueryParams> {
    const currentParams = this.queryParams();
    if (!currentParams) return {};

    const updates: Partial<CollectionQueryParams> = {};

    if (searchText !== currentParams['search']) {
      updates.search = searchText || undefined;
    }

    if (sortBy !== currentParams['sort']) {
      updates.sort = sortBy;
    }

    if (page !== currentParams['page']) {
      updates.page = page;
    }

    const activeFiltersParam = this.createActiveFiltersParam(selectedFilters);
    if (activeFiltersParam !== currentParams['activeFilters']) {
      updates.activeFilters = activeFiltersParam;
    }

    return updates;
  }

  private createActiveFiltersParam(selectedFilters: CollectionsFilters): string | null {
    const hasFilters = this.hasActiveFilters(selectedFilters);
    return hasFilters ? JSON.stringify(this.getSelectedFilters(selectedFilters)) : null;
  }

  private hasUrlUpdates(updates: Partial<CollectionQueryParams>): boolean {
    return Object.keys(updates).length > 0;
  }

  private updateUrlQueryParams(updates: Partial<CollectionQueryParams>): void {
    const currentParams = this.queryParams() || {};
    const queryParams: Record<string, string | null> = {};

    queryParamsKeys.forEach((key) => {
      const updateValue = updates[key as keyof CollectionQueryParams];
      const currentValue = currentParams[key];

      if (key in updates) {
        queryParams[key] = updateValue ? updateValue.toString() : null;
      } else if (currentValue) {
        queryParams[key] = currentValue;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  private hasAvailableFilterOptions(options: CollectionsFilters): boolean {
    return Object.values(options).some((filterArray) => Array.isArray(filterArray) && filterArray.length);
  }

  private isValidFilterArray(filterValues: unknown, availableValues: unknown): boolean {
    return Array.isArray(filterValues) && Array.isArray(availableValues);
  }

  private getValidFilterValues(filterValues: string[], availableValues: (string | { value: string })[]): string[] {
    return filterValues.filter((value) =>
      availableValues.some((option: string | { value: string }) => {
        return typeof option === 'string' ? option === value : option.value === value;
      })
    );
  }

  private getSelectedFilters(filters: CollectionsFilters): Partial<CollectionsFilters> {
    const result: Partial<CollectionsFilters> = {};
    const filterKeys = Object.keys(filters) as (keyof CollectionsFilters)[];

    filterKeys.forEach((key) => {
      const filterArray = filters[key];
      if (Array.isArray(filterArray) && filterArray.length) {
        result[key] = filterArray;
      }
    });

    return result;
  }

  private hasActiveFilters(filters: CollectionsFilters): boolean {
    return Object.values(filters).some((filterArray) => Array.isArray(filterArray) && filterArray.length);
  }
}
