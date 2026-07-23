import { ReviewActionTrigger } from '@osf/shared/enums/trigger-action.enum';

import { ToOneRelData } from '../common/json-api/relationships.model';

export interface ReviewActionPayloadJsonApi<TActionType extends string, TTargetType extends string> {
  data: {
    type: TActionType;
    attributes: ReviewActionPayloadAttributesJsonApi;
    relationships: ReviewActionPayloadRelationshipsJsonApi<TTargetType>;
  };
}

interface ReviewActionPayloadAttributesJsonApi {
  comment: string;
  trigger: ReviewActionTrigger | string;
}

interface ReviewActionPayloadRelationshipsJsonApi<TTargetType extends string> {
  target: ToOneRelData<TTargetType>;
}
