import { ResourceTab } from '@osf/shared/enums';
import { AsyncStateModel, Resource } from '@osf/shared/models';

export interface SearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  resourceTab: ResourceTab;
  first: string;
  next: string;
  previous: string;
  isMyProfile: boolean;
}
