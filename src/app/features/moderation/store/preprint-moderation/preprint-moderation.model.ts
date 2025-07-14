import { PreprintProviderShortInfo } from '@osf/features/preprints/models';
import { AsyncStateModel, AsyncStateWithTotalCount } from '@osf/shared/models';

import { PreprintReviewActionModel } from '../../models';

export interface PreprintModerationStateModel {
  preprintProviders: AsyncStateModel<PreprintProviderShortInfo[]>;
  reviewActions: AsyncStateWithTotalCount<PreprintReviewActionModel[]>;
}

export const PREPRINT_MODERATION_STATE_DEFAULTS = {
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
