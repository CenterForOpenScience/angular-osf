import { Selector } from '@ngxs/store';

import { MyPreprintsStateModel } from './my-preprints.model';
import { MyPreprintsState } from './my-preprints.state';

export class MyPreprintsSelectors {
  @Selector([MyPreprintsState])
  static getMyPreprints(state: MyPreprintsStateModel) {
    return state.myPreprints.data;
  }

  @Selector([MyPreprintsState])
  static getMyPreprintsTotalCount(state: MyPreprintsStateModel) {
    return state.myPreprints.totalCount;
  }

  @Selector([MyPreprintsState])
  static areMyPreprintsLoading(state: MyPreprintsStateModel) {
    return state.myPreprints.isLoading;
  }
}
