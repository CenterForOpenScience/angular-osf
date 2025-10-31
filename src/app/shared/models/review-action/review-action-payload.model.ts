import { ReviewActionTrigger } from '@osf/shared/enums/trigger-action.enum';

export interface ReviewActionPayload {
  targetId: string;
  action: ReviewActionTrigger | string;
  comment: string;
}
