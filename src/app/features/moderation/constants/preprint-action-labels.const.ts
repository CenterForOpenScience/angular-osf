import { ActionStatus } from '../enums';

export const PREPRINT_ACTION_LABEL: Record<ActionStatus | string, string> = {
  [ActionStatus.Accepted]: 'moderation.submissionReview.accepted',
  [ActionStatus.Pending]: 'moderation.submissionReview.submitted',
  [ActionStatus.Rejected]: 'moderation.submissionReview.rejected',
};
