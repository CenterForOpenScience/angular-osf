import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { SubjectMapper } from '@osf/shared/mappers';
import { ISubjectsService, Subject, SubjectsResponseJsonApi } from '@osf/shared/models';

import { environment } from 'src/environments/environment';

@Injectable()
export class RegistrationSubjectsService implements ISubjectsService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getSubjects(search?: string): Observable<Subject[]> {
    const params: Record<string, string> = {
      'page[size]': '100',
      sort: 'text',
      related_counts: 'children',
      'filter[parent]': 'null',
    };
    if (search) {
      delete params['filter[parent]'];
      params['filter[text]'] = search;
      params['embed'] = 'parent';
    }
    return this.jsonApiService
      .get<SubjectsResponseJsonApi>(`${this.apiUrl}/providers/registrations/osf/subjects/`, params)
      .pipe(
        map((response) => {
          return SubjectMapper.fromSubjectsResponseJsonApi(response);
        })
      );
  }

  getChildrenSubjects(parentId: string): Observable<Subject[]> {
    const params: Record<string, string> = {
      'page[size]': '100',
      page: '1',
      sort: 'text',
      related_counts: 'children',
    };

    return this.jsonApiService
      .get<SubjectsResponseJsonApi>(`${this.apiUrl}/subjects/${parentId}/children/`, params)
      .pipe(
        map((response) => {
          return SubjectMapper.fromSubjectsResponseJsonApi(response);
        })
      );
  }

  getRegistrationSubjects(draftId: string): Observable<Subject[]> {
    return this.jsonApiService
      .get<SubjectsResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/subjects/`)
      .pipe(
        map((response) => {
          return SubjectMapper.fromSubjectsResponseJsonApi(response);
        })
      );
  }

  updateRegistrationSubjects(draftId: string, subjects: Subject[]): Observable<void> {
    const payload = {
      data: subjects.map((item) => ({ id: item.id, type: 'subjects' })),
    };

    return this.jsonApiService.put(`${this.apiUrl}/draft_registrations/${draftId}/relationships/subjects/`, payload);
  }
}
