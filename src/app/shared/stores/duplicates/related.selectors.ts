import { Selector } from '@ngxs/store';

import { DuplicatesStateModel } from './related.model';
import { RelatedState } from './related.state.service';

export class RelatedSelectors {
  @Selector([RelatedState])
  static getRelated(state: DuplicatesStateModel) {
    return state.related.data;
  }

  @Selector([RelatedState])
  static getRelatedLoading(state: DuplicatesStateModel) {
    return state.related.isLoading;
  }

  @Selector([RelatedState])
  static getRelatedTotalCount(state: DuplicatesStateModel) {
    return state.related.totalCount;
  }
}
