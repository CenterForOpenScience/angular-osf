import { AsyncStateModel, ComponentOverview } from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';

import { ProjectOverview } from '../models';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  components: AsyncStateModel<ComponentOverview[]>;
  componentsTree: AsyncStateModel<Project[]>;
}

export const PROJECT_OVERVIEW_DEFAULTS: ProjectOverviewStateModel = {
  project: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  components: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  componentsTree: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
