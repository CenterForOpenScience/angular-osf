import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { ResourceTab } from '@shared/enums';
import { AsyncStateModel, DiscoverableFilter, Resource, SelectOption } from '@shared/models';

export interface RegistriesProviderSearchStateModel {
  currentBrandedProvider: AsyncStateModel<RegistryProviderDetails | null>;
  resourceType: ResourceTab;
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
}
