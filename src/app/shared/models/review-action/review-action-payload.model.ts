import { ReviewActionTrigger } from '@osf/shared/enums';

export interface ReviewActionPayload {
  targetId: string;
  action: ReviewActionTrigger | string;
  comment: string;
}
