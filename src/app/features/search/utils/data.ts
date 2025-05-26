import { ResourceTab } from '@osf/shared/enums/resource-tab.enum';

export const searchStateDefaults = {
  resources: [],
  resourcesCount: 0,
  searchText: '',
  sortBy: '-relevance',
  resourceTab: ResourceTab.All,
  first: '',
  next: '',
  previous: '',
  isMyProfile: false,
};
