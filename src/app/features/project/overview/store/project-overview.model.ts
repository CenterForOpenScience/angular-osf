import { AsyncStateModel, BaseNodeModel, ComponentOverview } from '@osf/shared/models';

import { ProjectOverview } from '../models';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  components: AsyncStateModel<ComponentOverview[]>;
  isAnonymous: boolean;
  duplicatedProject: BaseNodeModel | null;
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
  isAnonymous: false,
  duplicatedProject: null,
};
