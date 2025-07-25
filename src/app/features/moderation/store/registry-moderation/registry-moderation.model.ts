import { AsyncStateWithTotalCount } from '@osf/shared/models';

import { RegistryModeration } from '../../models';

export interface RegistryModerationStateModel {
  submissions: AsyncStateWithTotalCount<RegistryModeration[]>;
}

export const REGISTRY_MODERATION_STATE_DEFAULTS: RegistryModerationStateModel = {
  submissions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
