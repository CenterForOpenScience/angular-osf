import { AsyncStateModel } from '@shared/models';
import { Project } from '@shared/models/projects';

export interface ProjectsModel {
  projects: AsyncStateModel<Project[]>;
}
