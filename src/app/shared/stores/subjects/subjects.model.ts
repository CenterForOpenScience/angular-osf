import { AsyncStateModel, SubjectModel } from '@shared/models';

export interface SubjectsModel {
  subjects: AsyncStateModel<SubjectModel[]>;
  searchedSubjects: AsyncStateModel<SubjectModel[]>;
  selectedSubjects: AsyncStateModel<SubjectModel[]>;
}
