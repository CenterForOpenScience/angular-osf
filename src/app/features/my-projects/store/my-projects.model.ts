import { MyProjectsItem } from '@osf/features/my-projects/models/my-projects.models';
import { AsyncStateModel } from '@osf/shared/models/store';

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
