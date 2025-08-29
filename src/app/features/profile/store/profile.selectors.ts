import { Selector } from '@ngxs/store';

import { DiscoverableFilter, Resource, SelectOption, User } from '@osf/shared/models';
import { StringOrNull } from '@shared/helpers';

import { ProfileStateModel } from './profile.model';
import { ProfileState } from '.';

export class ProfileSelectors {
  @Selector([ProfileState])
  static getUserProfile(state: ProfileStateModel): User | null {
    return state.userProfile.data;
  }

  @Selector([ProfileState])
  static isUserProfileLoading(state: ProfileStateModel): boolean {
    return state.userProfile.isLoading;
  }

  @Selector([ProfileState])
  static getResources(state: ProfileStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([ProfileState])
  static getResourcesLoading(state: ProfileStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([ProfileState])
  static getFilters(state: ProfileStateModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([ProfileState])
  static getResourcesCount(state: ProfileStateModel): number {
    return state.resourcesCount;
  }

  @Selector([ProfileState])
  static getSearchText(state: ProfileStateModel): StringOrNull {
    return state.searchText;
  }

  @Selector([ProfileState])
  static getSortBy(state: ProfileStateModel): string {
    return state.sortBy;
  }

  @Selector([ProfileState])
  static getFirst(state: ProfileStateModel): string {
    return state.first;
  }

  @Selector([ProfileState])
  static getNext(state: ProfileStateModel): string {
    return state.next;
  }

  @Selector([ProfileState])
  static getPrevious(state: ProfileStateModel): string {
    return state.previous;
  }

  @Selector([ProfileState])
  static getResourceType(state: ProfileStateModel) {
    return state.resourceType;
  }

  @Selector([ProfileState])
  static getFilterValues(state: ProfileStateModel): Record<string, StringOrNull> {
    return state.filterValues;
  }

  @Selector([ProfileState])
  static getFilterOptionsCache(state: ProfileStateModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }

  @Selector([ProfileState])
  static getFilterSearchCache(state: ProfileStateModel): Record<string, SelectOption[]> {
    return state.filterSearchCache;
  }

  @Selector([ProfileState])
  static getFilterPaginationCache(state: ProfileStateModel): Record<string, string> {
    return state.filterPaginationCache;
  }
}
