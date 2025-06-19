import { NodeSubjectModel } from '@shared/models';

export interface SubjectsStateModel {
  highlightedSubjects: NodeSubjectModel[];
  highlightedSubjectsLoading: boolean;
}
