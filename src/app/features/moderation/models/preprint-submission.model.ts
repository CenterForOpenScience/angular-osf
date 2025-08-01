import { PaginatedData } from '@osf/shared/models';

import { ReviewAction } from './review-action.model';

export interface PreprintSubmissionPaginatedData extends PaginatedData<PreprintSubmission[]> {
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  withdrawnCount: number;
}

export interface PreprintSubmission {
  id: string;
  title: string;
  reviewsState: string;
  public: boolean;
  actions: ReviewAction[];
}
