import { StringOrNull } from '@osf/shared/helpers';
import { AsyncStateModel, DiscoverableFilter, Resource, SelectOption } from '@osf/shared/models';
import { ResourceType } from '@shared/enums';

export interface GlobalSearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  filters: DiscoverableFilter[];
  defaultFilterValues: Record<string, string>;
  filterValues: Record<string, StringOrNull>;
  filterOptionsCache: Record<string, SelectOption[]>;
  filterSearchCache: Record<string, SelectOption[]>;
  filterPaginationCache: Record<string, string>;
  resourcesCount: number;
  searchText: StringOrNull;
  sortBy: string;
  self: string;
  first: StringOrNull;
  next: StringOrNull;
  previous: StringOrNull;
  resourceType: ResourceType;
}

export const GLOBAL_SEARCH_STATE_DEFAULTS = {
  resources: {
    data: [],
    isLoading: false,
    error: null,
  },
  filters: [],
  defaultFilterValues: {},
  filterValues: {},
  filterOptionsCache: {},
  filterSearchCache: {},
  filterPaginationCache: {},
  resourcesCount: 0,
  searchText: '',
  sortBy: '-relevance',
  resourceType: ResourceType.Null,
  self: '',
  first: null,
  next: null,
  previous: null,
};
