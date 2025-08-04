import { ResourceTab } from '@osf/shared/enums';
import { AsyncStateModel, DiscoverableFilter, Resource, SelectOption } from '@osf/shared/models';

export interface SearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  filters: DiscoverableFilter[];
  filterValues: Record<string, string | null>;
  filterOptionsCache: Record<string, SelectOption[]>;
  filterSearchCache: Record<string, SelectOption[]>;
  filterPaginationCache: Record<string, string>;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  resourceTab: ResourceTab;
  first: string;
  next: string;
  previous: string;
  isMyProfile: boolean;
}
