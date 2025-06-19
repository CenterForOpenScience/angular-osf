import { Selector } from '@ngxs/store';

import { SubjectsState, SubjectsStateModel } from '@shared/stores';

export class SubjectsSelectors {
  @Selector([SubjectsState])
  static getHighlightedSubjects(state: SubjectsStateModel) {
    return state.highlightedSubjects;
  }

  @Selector([SubjectsState])
  static getHighlightedSubjectsLoading(state: SubjectsStateModel): boolean {
    return state.highlightedSubjectsLoading;
  }
}
