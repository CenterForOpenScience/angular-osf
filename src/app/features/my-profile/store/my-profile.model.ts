import { ResourceTab } from '@osf/shared/enums/resource-tab.enum';
import { Resource } from '@osf/shared/models/resource-card/resource.model';

export interface MyProfileStateModel {
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
