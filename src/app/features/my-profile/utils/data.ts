import { ResourceTab } from '@osf/shared/enums';

export const myProfileStateDefaults = {
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
