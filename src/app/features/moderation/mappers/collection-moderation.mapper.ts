import { CollectionReviewAction, CollectionReviewActionJsonApiModel } from '@osf/features/moderation/models';

export class CollectionModerationMapper {
  static fromActionResponse(action: CollectionReviewActionJsonApiModel): CollectionReviewAction {
    return {
      id: action.id,
      type: action.type,
      dateModified: action.attributes.date_modified,
      fromState: action.attributes.from_state,
      toState: action.attributes.to_state,
      comment: action.attributes.comment,
      trigger: action.attributes.trigger,
    };
  }
}
