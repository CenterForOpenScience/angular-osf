import { Selector } from '@ngxs/store';

import { DuplicatesStateModel } from './duplicates.model';
import { DuplicatesState } from './duplicates.state';

export class DuplicatesSelectors {
  @Selector([DuplicatesState])
  static getDuplicates(state: DuplicatesStateModel) {
    return state.duplicates.data;
  }

  @Selector([DuplicatesState])
  static getDuplicatesLoading(state: DuplicatesStateModel) {
    return state.duplicates.isLoading;
  }

  @Selector([DuplicatesState])
  static getDuplicatesTotalCount(state: DuplicatesStateModel) {
    return state.duplicates.totalCount;
  }
}
