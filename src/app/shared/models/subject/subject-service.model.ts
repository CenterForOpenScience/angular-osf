import { Observable } from 'rxjs';

import { Subject } from './subject.model';

export interface ISubjectsService {
  getSubjects(providerId: string, search?: string): Observable<Subject[]>;

  getChildrenSubjects(parentId: string): Observable<Subject[]>;
}
