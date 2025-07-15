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
}
