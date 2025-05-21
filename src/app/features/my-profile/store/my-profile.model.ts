import { Resource } from '@shared/entities/resource-card/resource.entity';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';

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
