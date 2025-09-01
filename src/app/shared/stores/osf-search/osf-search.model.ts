import { StringOrNull } from '@osf/shared/helpers';
import { AsyncStateModel, DiscoverableFilter, Resource, SelectOption } from '@osf/shared/models';
import { ResourceTab } from '@shared/enums';

export interface OsfSearchStateModel {
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
  first: string;
  next: string;
  previous: string;
  resourceType: ResourceTab;
}

export const OSF_SEARCH_STATE_DEFAULTS = {
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
  resourceType: ResourceTab.All,
  first: '',
  next: '',
  previous: '',
};
