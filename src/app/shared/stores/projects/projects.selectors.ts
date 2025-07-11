import { Selector } from '@ngxs/store';

import { ProjectsStateModel } from './projects.model';
import { ProjectsState } from './projects.state';

export class ProjectsSelectors {
  @Selector([ProjectsState])
  static getProjects(state: ProjectsStateModel) {
    return state.projects.data;
  }

  @Selector([ProjectsState])
  static getProjectsLoading(state: ProjectsStateModel): boolean {
    return state.projects.isLoading;
  }

  @Selector([ProjectsState])
  static getSelectedProject(state: ProjectsStateModel) {
    return state.selectedProject.data;
  }

  @Selector([ProjectsState])
  static getSelectedProjectUpdateSubmitting(state: ProjectsStateModel) {
    return state.selectedProject.isSubmitting;
  }
}
