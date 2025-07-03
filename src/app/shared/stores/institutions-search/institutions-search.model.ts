import { ResourceTab } from '@shared/enums';
import { AsyncStateModel, DiscoverableFilter, Institution, Resource, SelectOption } from '@shared/models';

export interface InstitutionsSearchModel {
  institution: AsyncStateModel<Institution>;
  resources: AsyncStateModel<Resource[]>;
  filters: DiscoverableFilter[];
  filterValues: Record<string, string | null>;
  filterOptionsCache: Record<string, SelectOption[]>;
  providerIri: string;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  first: string;
  next: string;
  previous: string;
  resourceType: ResourceTab;
}
