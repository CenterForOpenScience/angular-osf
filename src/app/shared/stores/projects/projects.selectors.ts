import { Selector } from '@ngxs/store';

import { ProjectsModel, ProjectsState } from '@shared/stores';

export class ProjectsSelectors {
  @Selector([ProjectsState])
  static getAdminProjects(state: ProjectsModel) {
    return state.adminProjects.data;
  }

  @Selector([ProjectsState])
  static getAdminProjectsLoading(state: ProjectsModel): boolean {
    return state.adminProjects.isLoading;
  }

  @Selector([ProjectsState])
  static getAdminProjectsError(state: ProjectsModel) {
    return state.adminProjects.error;
  }
}
