import { AsyncStateModel } from '@osf/shared/models';

import { NodeDetailsModel, ProjectSettingsModel } from '../models';

export interface SettingsStateModel {
  settings: AsyncStateModel<ProjectSettingsModel>;
  projectDetails: AsyncStateModel<NodeDetailsModel>;
}

export const SETTINGS_STATE_DEFAULTS: SettingsStateModel = {
  settings: {
    data: {} as ProjectSettingsModel,
    isLoading: false,
    error: null,
  },
  projectDetails: {
    data: {} as NodeDetailsModel,
    isLoading: false,
    error: null,
  },
};
