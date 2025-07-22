import { Selector } from '@ngxs/store';

import { PreprintStateModel } from './preprint.model';
import { PreprintState } from './preprint.state';

export class PreprintSelectors {
  @Selector([PreprintState])
  static getMyPreprints(state: PreprintStateModel) {
    return state.myPreprints.data;
  }

  @Selector([PreprintState])
  static getMyPreprintsTotalCount(state: PreprintStateModel) {
    return state.myPreprints.totalCount;
  }

  @Selector([PreprintState])
  static areMyPreprintsLoading(state: PreprintStateModel) {
    return state.myPreprints.isLoading;
  }

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
}
