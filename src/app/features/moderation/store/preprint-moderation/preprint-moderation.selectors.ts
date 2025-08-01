import { Selector } from '@ngxs/store';

import { PreprintModerationStateModel } from './preprint-moderation.model';
import { PreprintModerationState } from './preprint-moderation.state';

export class PreprintModerationSelectors {
  @Selector([PreprintModerationState])
  static getPreprintProviders(state: PreprintModerationStateModel) {
    return state.preprintProviders.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintProviderLoading(state: PreprintModerationStateModel) {
    return state.preprintProviders.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintProvider(state: PreprintModerationStateModel) {
    return (id: string) => state.preprintProviders.data.find((item) => item.id === id);
  }

  @Selector([PreprintModerationState])
  static getPreprintReviews(state: PreprintModerationStateModel) {
    return state.reviewActions.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintReviewsLoading(state: PreprintModerationStateModel) {
    return state.reviewActions.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintReviewsTotalCount(state: PreprintModerationStateModel) {
    return state.reviewActions.totalCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissions(state: PreprintModerationStateModel) {
    return state.submissions.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintSubmissionsLoading(state: PreprintModerationStateModel) {
    return state.submissions.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissionsTotalCount(state: PreprintModerationStateModel) {
    return state.submissions.totalCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissionsPendingCount(state: PreprintModerationStateModel) {
    return state.submissions.pendingCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissionsAcceptedCount(state: PreprintModerationStateModel) {
    return state.submissions.acceptedCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissionsRejectedCount(state: PreprintModerationStateModel) {
    return state.submissions.rejectedCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintSubmissionsWithdrawnCount(state: PreprintModerationStateModel) {
    return state.submissions.withdrawnCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintWithdrawalSubmissions(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintWithdrawalSubmissionsLoading(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintWithdrawalSubmissionsTotalCount(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.totalCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintWithdrawalSubmissionsPendingCount(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.pendingCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintWithdrawalSubmissionsAcceptedCount(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.acceptedCount;
  }

  @Selector([PreprintModerationState])
  static getPreprintWithdrawalSubmissionsRejectedCount(state: PreprintModerationStateModel) {
    return state.withdrawalSubmissions.rejectedCount;
  }
}
