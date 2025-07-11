import { Observable } from 'rxjs';

import { SubjectModel } from './subject.model';

export interface ISubjectsService {
  getSubjects(providerId: string, search?: string): Observable<SubjectModel[]>;

  getChildrenSubjects(parentId: string): Observable<SubjectModel[]>;
}
