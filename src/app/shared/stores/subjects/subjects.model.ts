import { AsyncStateModel, NodeSubjectModel, Subject } from '@shared/models';

export interface SubjectsModel {
  highlightedSubjects: AsyncStateModel<NodeSubjectModel[]>;
  subjects: AsyncStateModel<Subject[]>;
  searchedSubjects: AsyncStateModel<Subject[]>;
}
