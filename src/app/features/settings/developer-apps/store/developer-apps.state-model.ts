import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { DeveloperApp } from '../models';

export type DeveloperAppsStateModel = AsyncStateModel<DeveloperApp[]>;

export const DEVELOPER_APPS_STATE_DEFAULTS: DeveloperAppsStateModel = {
  data: [],
  isLoading: false,
  error: null,
};
