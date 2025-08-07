import { TriggerAction } from '@osf/shared/enums/trigger-action.enum';

export interface ReviewActionPayload {
  targetId: string;
  action: TriggerAction | string;
  comment: string;
}
