import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { NodeDetailsModel, ProjectSettingsModel } from '../models';

export interface SettingsStateModel {
  settings: AsyncStateModel<ProjectSettingsModel>;
  projectDetails: AsyncStateModel<NodeDetailsModel>;
  notifications: AsyncStateModel<NotificationSubscription[]>;
}

export const SETTINGS_STATE_DEFAULTS: SettingsStateModel = {
  settings: {
    data: {} as ProjectSettingsModel,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  projectDetails: {
    data: {} as NodeDetailsModel,
    isLoading: false,
    error: null,
  },
  notifications: {
    data: [],
    isLoading: false,
    error: '',
  },
};
