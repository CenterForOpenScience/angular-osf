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
