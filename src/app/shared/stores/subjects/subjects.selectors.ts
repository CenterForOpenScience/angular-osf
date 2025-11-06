import { Selector } from '@ngxs/store';

import { SubjectModel } from '@osf/shared/models/subject/subject.model';

import { SubjectsModel } from './subjects.model';
import { SubjectsState } from './subjects.state';

export class SubjectsSelectors {
  @Selector([SubjectsState])
  static getSubjects(state: SubjectsModel): SubjectModel[] {
    return state.subjects.data;
  }

  @Selector([SubjectsState])
  static getSubjectsLoading(state: SubjectsModel): boolean {
    return state.subjects.isLoading;
  }

  @Selector([SubjectsState])
  static getSearchedSubjects(state: SubjectsModel): SubjectModel[] {
    return state.searchedSubjects.data;
  }

  @Selector([SubjectsState])
  static getSearchedSubjectsLoading(state: SubjectsModel): boolean {
    return state.searchedSubjects.isLoading;
  }

  @Selector([SubjectsState])
  static getSelectedSubjects(state: SubjectsModel): SubjectModel[] {
    return state.selectedSubjects.data;
  }

  @Selector([SubjectsState])
  static areSelectedSubjectsLoading(state: SubjectsModel): boolean {
    return state.selectedSubjects.isLoading;
  }
}
