import { AsyncStateModel, AsyncStateWithTotalCount } from '@osf/shared/models';

import { PreprintProviderModerationInfo, PreprintReviewActionModel, PreprintWithdrawalSubmission } from '../../models';
import { PreprintSubmission } from '../../models/preprint-submission.model';

export interface PreprintModerationStateModel {
  preprintProviders: AsyncStateModel<PreprintProviderModerationInfo[]>;
  reviewActions: AsyncStateWithTotalCount<PreprintReviewActionModel[]>;
  submissions: SubmissionsWithCount;
  withdrawalSubmissions: WithdrawalSubmissionsWithCount;
}

interface SubmissionsWithCount extends AsyncStateWithTotalCount<PreprintSubmission[]> {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  withdrawnCount: number;
}

interface WithdrawalSubmissionsWithCount extends AsyncStateWithTotalCount<PreprintWithdrawalSubmission[]> {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
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
  submissions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    withdrawnCount: 0,
  },
  withdrawalSubmissions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  },
};
