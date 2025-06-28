import { Selector } from '@ngxs/store';

import { DiscoverableFilter, Resource, SelectOption } from '@shared/models';

import { InstitutionsSearchModel } from './institutions-search.model';
import { InstitutionsSearchState } from './institutions-search.state';

export class InstitutionsSearchSelectors {
  @Selector([InstitutionsSearchState])
  static getInstitution(state: InstitutionsSearchModel) {
    return state.institution.data;
  }

  @Selector([InstitutionsSearchState])
  static getInstitutionLoading(state: InstitutionsSearchModel) {
    return state.institution.isLoading;
  }

  @Selector([InstitutionsSearchState])
  static getResources(state: InstitutionsSearchModel): Resource[] {
    return state.resources.data;
  }

  @Selector([InstitutionsSearchState])
  static getResourcesLoading(state: InstitutionsSearchModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([InstitutionsSearchState])
  static getFilters(state: InstitutionsSearchModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([InstitutionsSearchState])
  static getResourcesCount(state: InstitutionsSearchModel): number {
    return state.resourcesCount;
  }

  @Selector([InstitutionsSearchState])
  static getSearchText(state: InstitutionsSearchModel): string {
    return state.searchText;
  }

  @Selector([InstitutionsSearchState])
  static getSortBy(state: InstitutionsSearchModel): string {
    return state.sortBy;
  }

  @Selector([InstitutionsSearchState])
  static getIris(state: InstitutionsSearchModel): string {
    return state.providerIri;
  }

  @Selector([InstitutionsSearchState])
  static getFirst(state: InstitutionsSearchModel): string {
    return state.first;
  }

  @Selector([InstitutionsSearchState])
  static getNext(state: InstitutionsSearchModel): string {
    return state.next;
  }

  @Selector([InstitutionsSearchState])
  static getPrevious(state: InstitutionsSearchModel): string {
    return state.previous;
  }

  @Selector([InstitutionsSearchState])
  static getResourceType(state: InstitutionsSearchModel) {
    return state.resourceType;
  }

  @Selector([InstitutionsSearchState])
  static getFilterValues(state: InstitutionsSearchModel): Record<string, string | null> {
    return state.filterValues;
  }

  @Selector([InstitutionsSearchState])
  static getFilterOptionsCache(state: InstitutionsSearchModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }
}
