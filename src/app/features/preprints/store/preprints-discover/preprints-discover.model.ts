import { AsyncStateModel, Resource } from '@shared/models';

export interface PreprintsDiscoverStateModel {
  resources: AsyncStateModel<Resource[]>;
  providerIri: string;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  first: string;
  next: string;
  previous: string;
}
