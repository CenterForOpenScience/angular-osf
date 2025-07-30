import { AsyncStateModel } from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';

export interface ProjectsStateModel {
  projects: AsyncStateModel<Project[]>;
  selectedProject: AsyncStateModel<Project | null>;
}
