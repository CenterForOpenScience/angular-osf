import { AsyncStateModel } from '@osf/shared/models';

import { MyProjectsItem } from '../models';

export interface MyProjectsStateModel {
  projects: AsyncStateModel<MyProjectsItem[]>;
  registrations: AsyncStateModel<MyProjectsItem[]>;
  preprints: AsyncStateModel<MyProjectsItem[]>;
  bookmarks: AsyncStateModel<MyProjectsItem[]>;
  totalProjects: number;
  totalRegistrations: number;
  totalPreprints: number;
  totalBookmarks: number;
}

export const MY_PROJECT_STATE_DEFAULTS: MyProjectsStateModel = {
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
