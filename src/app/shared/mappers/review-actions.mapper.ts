import { ReviewActionPayload, ReviewActionPayloadJsonApi } from '../models/review-action';

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
