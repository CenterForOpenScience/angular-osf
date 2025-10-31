import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { SubjectModel } from '@osf/shared/models/subject/subject.model';

export interface SubjectsModel {
  subjects: AsyncStateModel<SubjectModel[]>;
  searchedSubjects: AsyncStateModel<SubjectModel[]>;
  selectedSubjects: AsyncStateModel<SubjectModel[]>;
}

export const SUBJECT_STATE_DEFAULTS: SubjectsModel = {
  subjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  searchedSubjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  selectedSubjects: {
    data: [],
    isLoading: false,
    error: null,
  },
};
