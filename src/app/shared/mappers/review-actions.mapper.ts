import { ReviewActionPayload } from '../models/review-action/review-action-payload.model';
import { ReviewActionPayloadJsonApi } from '../models/review-action/review-action-payload-json-api.model';

export class ReviewActionsMapper {
  static toReviewActionPayloadJsonApi(
    payload: ReviewActionPayload,
    actionType: string,
    targetType: string
  ): ReviewActionPayloadJsonApi<string, string> {
    return {
      data: {
        type: actionType,
        attributes: {
          trigger: payload.action,
          comment: payload.comment,
        },
        relationships: {
          target: {
            data: {
              type: targetType,
              id: payload.targetId,
            },
          },
        },
      },
    };
  }
}
