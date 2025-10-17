import { ContributorModel, PaginatedData } from '@osf/shared/models';

import { ReviewAction } from './review-action.model';

export interface PreprintWithdrawalPaginatedData extends PaginatedData<PreprintWithdrawalSubmission[]> {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}

export interface PreprintWithdrawalSubmission {
  id: string;
  title: string;
  preprintId: string;
  actions: ReviewAction[];
  contributors: ContributorModel[];
  totalContributors: number;
  contributorsLoading?: boolean;
}
