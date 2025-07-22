import { AsyncStateModel } from '@shared/models';

import { MyResourcesItem } from 'src/app/shared/models/my-resources';

export interface MyResourcesStateModel {
  projects: AsyncStateModel<MyResourcesItem[]>;
  registrations: AsyncStateModel<MyResourcesItem[]>;
  preprints: AsyncStateModel<MyResourcesItem[]>;
  bookmarks: AsyncStateModel<MyResourcesItem[]>;
  totalProjects: number;
  totalRegistrations: number;
  totalPreprints: number;
  totalBookmarks: number;
}

export const MY_RESOURCES_STATE_DEFAULTS: MyResourcesStateModel = {
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  registrations: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprints: {
    data: [],
    isLoading: false,
    error: null,
  },
  bookmarks: {
    data: [],
    isLoading: false,
    error: null,
  },
  totalProjects: 0,
  totalRegistrations: 0,
  totalPreprints: 0,
  totalBookmarks: 0,
};
