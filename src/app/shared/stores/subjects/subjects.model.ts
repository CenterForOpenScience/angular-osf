import { AsyncStateModel, NodeSubjectModel } from '@shared/models';

export interface SubjectsModel {
  highlightedSubjects: AsyncStateModel<NodeSubjectModel[]>;
}
