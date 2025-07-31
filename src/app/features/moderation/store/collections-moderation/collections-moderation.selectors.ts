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
  static getCollectionSubmissionSubmitting(state: CollectionsModerationStateModel) {
    return state.collectionSubmissions.isSubmitting;
  }

  @Selector([CollectionsModerationState])
  static getCurrentReviewAction(state: CollectionsModerationStateModel) {
    return state.currentReviewAction.data;
  }

  @Selector([CollectionsModerationState])
  static getCurrentReviewActionLoading(state: CollectionsModerationStateModel) {
    return state.currentReviewAction.isLoading;
  }
}
