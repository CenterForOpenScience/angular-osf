import { Selector } from '@ngxs/store';

import { SubjectsModel } from './subjects.model';
import { SubjectsState } from './subjects.state';

export class SubjectsSelectors {
  @Selector([SubjectsState])
  static getParentSubjects(state: SubjectsModel) {
    return state.subjects.data;
  }

  @Selector([SubjectsState])
  static areParentSubjectsLoading(state: SubjectsModel) {
    return state.subjects.isLoading;
  }

  @Selector([SubjectsState])
  static getHighlightedSubjects(state: SubjectsModel) {
    return state.highlightedSubjects.data;
  }

  @Selector([SubjectsState])
  static getHighlightedSubjectsLoading(state: SubjectsModel): boolean {
    return state.highlightedSubjects.isLoading;
  }
}
