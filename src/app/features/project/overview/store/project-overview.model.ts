import { ComponentOverview, ProjectOverview } from '@osf/features/project/overview/models/project-overview.models';
import { AsyncStateModel } from '@osf/shared/models/store';

export interface ProjectOverviewStateModel {
  project: AsyncStateModel<ProjectOverview | null>;
  components: AsyncStateModel<ComponentOverview[]>;
  linkedProjects: AsyncStateModel<ComponentOverview[]>;
}
