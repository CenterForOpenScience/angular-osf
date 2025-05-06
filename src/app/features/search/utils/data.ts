import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';

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
