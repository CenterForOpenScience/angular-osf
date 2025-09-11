import { AsyncStateModel, SubjectModel } from '@shared/models';

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
