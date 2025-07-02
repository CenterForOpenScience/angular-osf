import { Selector } from '@ngxs/store';

import { Subject } from '@osf/shared/models';

import { SubjectsModel } from './subjects.model';
import { SubjectsState } from './subjects.state';

export class SubjectsSelectors {
  @Selector([SubjectsState])
  static getHighlightedSubjects(state: SubjectsModel) {
    return state.highlightedSubjects.data;
  }

  @Selector([SubjectsState])
  static getHighlightedSubjectsLoading(state: SubjectsModel): boolean {
    return state.highlightedSubjects.isLoading;
  }

  @Selector([SubjectsState])
  static getSubjects(state: SubjectsModel): Subject[] {
    return state.subjects.data;
  }

  @Selector([SubjectsState])
  static getSubjectsLoading(state: SubjectsModel): boolean {
    return state.subjects.isLoading;
  }

  @Selector([SubjectsState])
  static getSearchedSubjects(state: SubjectsModel): Subject[] {
    return state.searchedSubjects.data;
  }

  @Selector([SubjectsState])
  static getSearchedSubjectsLoading(state: SubjectsModel): boolean {
    return state.searchedSubjects.isLoading;
  }
}
