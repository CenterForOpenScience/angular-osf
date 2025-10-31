import { ReviewActionTrigger } from '@osf/shared/enums/trigger-action.enum';

export interface ReviewActionPayloadJsonApi<ActionType, TargetType> {
  data: {
    type: ActionType;
    attributes: {
      trigger: ReviewActionTrigger | string;
      comment: string;
    };
    relationships: {
      target: {
        data: {
          type: TargetType;
          id: string;
        };
      };
    };
  };
}
