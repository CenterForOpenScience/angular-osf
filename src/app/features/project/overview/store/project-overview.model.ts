import { AsyncStateModel, ComponentOverview } from '@osf/shared/models';

import { ProjectOverview } from '../models';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  components: AsyncStateModel<ComponentOverview[]>;
}
