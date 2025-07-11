import { AsyncStateModel } from '@shared/models';
import { Project } from '@shared/models/projects';

export interface ProjectsStateModel {
  projects: AsyncStateModel<Project[]>;
  selectedProject: AsyncStateModel<Project | null>;
}
