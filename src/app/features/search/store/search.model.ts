import { Resource } from '@osf/features/search/models/resource.entity';
import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';

export interface SearchStateModel {
  resources: Resource[];
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  resourceTab: ResourceTab;
  first: string;
  next: string;
  previous: string;
  isMyProfile: boolean;
}
