import { AsyncStateModel } from '@shared/models';
import { Project } from '@shared/models/projects';

export interface ProjectsModel {
  adminProjects: AsyncStateModel<Project[] | null>;
}
