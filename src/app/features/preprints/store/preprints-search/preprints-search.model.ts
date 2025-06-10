import { AsyncStateModel, Resource } from '@osf/shared/models';

export interface PreprintsSearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  first: string;
  next: string;
  previous: string;
}
