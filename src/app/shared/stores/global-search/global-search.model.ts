import { ResourceType } from '@osf/shared/enums';
import { StringOrNull } from '@osf/shared/helpers';
import { AsyncStateModel, DiscoverableFilter, FilterOption, ResourceModel } from '@osf/shared/models';

export interface GlobalSearchStateModel {
  resources: AsyncStateModel<ResourceModel[]>;
  filters: DiscoverableFilter[];
  defaultFilterOptions: Record<string, string>;
  selectedFilterOptions: Record<string, FilterOption | null>;
  filterOptionsCache: Record<string, FilterOption[]>;
  filterSearchCache: Record<string, FilterOption[]>;
  filterPaginationCache: Record<string, string>;
  resourcesCount: number;
  searchText: StringOrNull;
  sortBy: string;
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
  defaultFilterOptions: {},
  selectedFilterOptions: {},
  filterOptionsCache: {},
  filterSearchCache: {},
  filterPaginationCache: {},
  resourcesCount: 0,
  searchText: '',
  sortBy: '-relevance',
  resourceType: ResourceType.Null,
  first: null,
  next: null,
  previous: null,
};
