import { AsyncStateModel, NodeData } from '@osf/shared/models';

import { ProjectSettingsModel } from '../models';

export interface SettingsStateModel {
  settings: AsyncStateModel<ProjectSettingsModel>;
  projectDetails: AsyncStateModel<NodeData>;
}

export const SETTINGS_STATE_DEFAULTS: SettingsStateModel = {
  settings: {
    data: {} as ProjectSettingsModel,
    isLoading: false,
    error: null,
  },
  projectDetails: {
    data: {} as NodeData,
    isLoading: false,
    error: null,
  },
};
