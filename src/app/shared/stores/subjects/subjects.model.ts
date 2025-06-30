import { AsyncStateModel, NodeSubjectModel, SubjectModel } from '@shared/models';

export interface SubjectsModel {
  highlightedSubjects: AsyncStateModel<NodeSubjectModel[]>;
  subjects: AsyncStateModel<SubjectModel[]>;
  projectSubjects: AsyncStateModel<SubjectModel[]>;
}
