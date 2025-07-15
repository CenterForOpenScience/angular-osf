import { AsyncStateModel, AsyncStateWithTotalCount } from '@osf/shared/models';

import { PreprintProviderModerationInfo, PreprintReviewActionModel } from '../../models';

export interface PreprintModerationStateModel {
  preprintProviders: AsyncStateModel<PreprintProviderModerationInfo[]>;
  reviewActions: AsyncStateWithTotalCount<PreprintReviewActionModel[]>;
}

export const PREPRINT_MODERATION_STATE_DEFAULTS: PreprintModerationStateModel = {
  preprintProviders: {
    data: [],
    isLoading: false,
    error: null,
  },
  reviewActions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
