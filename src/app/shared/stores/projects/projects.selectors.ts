import { Selector } from '@ngxs/store';

import { ProjectsModel } from './projects.model';
import { ProjectsState } from './projects.state';

export class ProjectsSelectors {
  @Selector([ProjectsState])
  static getProjects(state: ProjectsModel) {
    return state.projects.data;
  }

  @Selector([ProjectsState])
  static getProjectsLoading(state: ProjectsModel): boolean {
    return state.projects.isLoading;
  }
}
