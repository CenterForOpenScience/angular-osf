import { MyProjectsItem } from '@osf/features/my-projects/entities/my-projects.entities';

export interface MyProjectsStateModel {
  projects: MyProjectsItem[];
  registrations: MyProjectsItem[];
  preprints: MyProjectsItem[];
  bookmarks: MyProjectsItem[];
  totalProjects: number;
  totalRegistrations: number;
  totalPreprints: number;
  totalBookmarks: number;
  bookmarksId: string;
}
