import { NodeData } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

import { ProjectSettingsModel } from '../models';

export interface SettingsStateModel {
  settings: AsyncStateModel<ProjectSettingsModel>;
  projectDetails: AsyncStateModel<NodeData>;
}
