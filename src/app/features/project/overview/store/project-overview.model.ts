import { AsyncStateModel } from '@osf/shared/models';

import { ComponentOverview, ProjectOverview } from '../models';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  components: AsyncStateModel<ComponentOverview[]>;
  linkedProjects: AsyncStateModel<ComponentOverview[]>;
}
