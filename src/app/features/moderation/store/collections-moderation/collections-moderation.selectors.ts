import { Selector } from '@ngxs/store';

import { CollectionsModerationStateModel } from './collections-moderation.model';
import { CollectionsModerationState } from './collections-moderation.state';

export class CollectionsModerationSelectors {
  @Selector([CollectionsModerationState])
  static getCollectionSubmissions(state: CollectionsModerationStateModel) {
    return state.collectionSubmissions.data;
  }

  @Selector([CollectionsModerationState])
  static getCollectionSubmissionsTotalCount(state: CollectionsModerationStateModel) {
    return state.collectionSubmissions.totalCount;
  }

  @Selector([CollectionsModerationState])
  static getCollectionSubmissionsLoading(state: CollectionsModerationStateModel) {
    return state.collectionSubmissions.isLoading;
  }

  @Selector([CollectionsModerationState])
  static getReviewActions(state: CollectionsModerationStateModel) {
    return state.reviewActions.data;
  }

  @Selector([CollectionsModerationState])
  static getReviewActionsLoading(state: CollectionsModerationStateModel) {
    return state.reviewActions.isLoading;
  }

  @Selector([CollectionsModerationState])
  static getReviewActionsSubmitting(state: CollectionsModerationStateModel) {
    return state.reviewActions.isSubmitting;
  }

  @Selector([CollectionsModerationState])
  static getCurrentSubmission(state: CollectionsModerationStateModel) {
    return state.currentSubmission;
  }

  @Selector([CollectionsModerationState])
  static getCurrentReviewAction(state: CollectionsModerationStateModel) {
    return state.currentReviewAction;
  }
}
