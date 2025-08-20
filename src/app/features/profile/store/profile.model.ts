import { ResourceTab } from '@osf/shared/enums';
import { AsyncStateModel, Resource, User } from '@osf/shared/models';

export interface ProfileStateModel {
  user: AsyncStateModel<User | null>;
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

export const PROFILE_STATE_DEFAULTS: ProfileStateModel = {
  user: {
    data: null,
    isLoading: false,
    error: null,
  },
  resources: {
    data: [],
    isLoading: false,
    error: null,
  },
  resourcesCount: 0,
  searchText: '',
  sortBy: '-relevance',
  resourceTab: ResourceTab.All,
  first: '',
  next: '',
  previous: '',
  isMyProfile: false,
};
