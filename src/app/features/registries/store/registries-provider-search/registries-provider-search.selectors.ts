import { Selector } from '@ngxs/store';

import { RegistriesProviderSearchStateModel } from '@osf/features/registries/store/registries-provider-search/registries-provider-search.model';
import { RegistriesProviderSearchState } from '@osf/features/registries/store/registries-provider-search/registries-provider-search.state';
import { DiscoverableFilter, Resource, SelectOption } from '@shared/models';

import { RegistryProviderDetails } from '../../models/registry-provider.model';

export class RegistriesProviderSearchSelectors {
  @Selector([RegistriesProviderSearchState])
  static getBrandedProvider(state: RegistriesProviderSearchStateModel): RegistryProviderDetails | null {
    return state.currentBrandedProvider.data;
  }

  @Selector([RegistriesProviderSearchState])
  static isBrandedProviderLoading(state: RegistriesProviderSearchStateModel): boolean {
    return state.currentBrandedProvider.isLoading;
  }

  @Selector([RegistriesProviderSearchState])
  static getResources(state: RegistriesProviderSearchStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([RegistriesProviderSearchState])
  static getResourcesLoading(state: RegistriesProviderSearchStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([RegistriesProviderSearchState])
  static getFilters(state: RegistriesProviderSearchStateModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([RegistriesProviderSearchState])
  static getResourcesCount(state: RegistriesProviderSearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([RegistriesProviderSearchState])
  static getSearchText(state: RegistriesProviderSearchStateModel): string {
    return state.searchText;
  }

  @Selector([RegistriesProviderSearchState])
  static getSortBy(state: RegistriesProviderSearchStateModel): string {
    return state.sortBy;
  }

  @Selector([RegistriesProviderSearchState])
  static getIris(state: RegistriesProviderSearchStateModel): string {
    return state.providerIri;
  }

  @Selector([RegistriesProviderSearchState])
  static getFirst(state: RegistriesProviderSearchStateModel): string {
    return state.first;
  }

  @Selector([RegistriesProviderSearchState])
  static getNext(state: RegistriesProviderSearchStateModel): string {
    return state.next;
  }

  @Selector([RegistriesProviderSearchState])
  static getPrevious(state: RegistriesProviderSearchStateModel): string {
    return state.previous;
  }

  @Selector([RegistriesProviderSearchState])
  static getResourceType(state: RegistriesProviderSearchStateModel) {
    return state.resourceType;
  }

  @Selector([RegistriesProviderSearchState])
  static getFilterValues(state: RegistriesProviderSearchStateModel): Record<string, string | null> {
    return state.filterValues;
  }

  @Selector([RegistriesProviderSearchState])
  static getFilterOptionsCache(state: RegistriesProviderSearchStateModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }
}
