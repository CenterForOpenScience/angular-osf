import { AsyncStateModel, ProjectModel } from '@osf/shared/models';

export interface ProjectsStateModel {
  projects: AsyncStateModel<ProjectModel[]>;
  selectedProject: AsyncStateModel<ProjectModel | null>;
}

export const PROJECTS_STATE_DEFAULTS: ProjectsStateModel = {
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  selectedProject: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
