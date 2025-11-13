import { Selector } from '@ngxs/store';

import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

import { PreprintStateModel } from './preprint.model';
import { PreprintState } from './preprint.state';

export class PreprintSelectors {
  @Selector([PreprintState])
  static getPreprint(state: PreprintStateModel) {
    return state.preprint.data;
  }

  @Selector([PreprintState])
  static isPreprintSubmitting(state: PreprintStateModel) {
    return state.preprint.isSubmitting;
  }

  @Selector([PreprintState])
  static isPreprintLoading(state: PreprintStateModel) {
    return state.preprint.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintFile(state: PreprintStateModel) {
    return state.preprintFile.data;
  }

  @Selector([PreprintState])
  static isPreprintFileLoading(state: PreprintStateModel) {
    return state.preprintFile.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintFileVersions(state: PreprintStateModel) {
    return state.fileVersions.data;
  }

  @Selector([PreprintState])
  static arePreprintFileVersionsLoading(state: PreprintStateModel) {
    return state.fileVersions.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintVersionIds(state: PreprintStateModel) {
    return state.preprintVersionIds.data;
  }

  @Selector([PreprintState])
  static arePreprintVersionIdsLoading(state: PreprintStateModel) {
    return state.preprintVersionIds.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintReviewActions(state: PreprintStateModel) {
    return state.preprintReviewActions.data;
  }

  @Selector([PreprintState])
  static arePreprintReviewActionsLoading(state: PreprintStateModel) {
    return state.preprintReviewActions.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintRequests(state: PreprintStateModel) {
    return state.preprintRequests.data;
  }

  @Selector([PreprintState])
  static arePreprintRequestsLoading(state: PreprintStateModel) {
    return state.preprintRequests.isLoading;
  }

  @Selector([PreprintState])
  static getPreprintRequestActions(state: PreprintStateModel) {
    return state.preprintRequestsActions.data;
  }

  @Selector([PreprintState])
  static arePreprintRequestActionsLoading(state: PreprintStateModel) {
    return state.preprintRequestsActions.isLoading;
  }

  @Selector([PreprintState])
  static hasAdminAccess(state: PreprintStateModel) {
    return state.preprint.data?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  }

  @Selector([PreprintState])
  static hasWriteAccess(state: PreprintStateModel) {
    return state.preprint.data?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }

  @Selector([PreprintState])
  static getPreprintMetrics(state: PreprintStateModel) {
    return state.metrics.data;
  }

  @Selector([PreprintState])
  static arePreprintMetricsLoading(state: PreprintStateModel) {
    return state.metrics.isLoading;
  }
}
