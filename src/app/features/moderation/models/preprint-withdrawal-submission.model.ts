import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

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
  contributorsPage?: number;
}
