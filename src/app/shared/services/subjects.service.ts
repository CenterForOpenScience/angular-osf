import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { SubjectMapper } from '@shared/mappers';
import { NodeSubjectModel, SubjectJsonApi, SubjectModel, UpdateSubjectRequestJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;

  getParentSubjects(): Observable<SubjectModel[]> {
    return this.jsonApiService
      .get<SubjectJsonApi>(
        `${this.apiUrl}/subjects/?filter[parent]=null&page[size]=150&sort=text&related_counts=children`
      )
      .pipe(map((response) => SubjectMapper.mapSubjects(response.data)));
  }

  getChildrenSubjects(id: string): Observable<SubjectModel[]> {
    return this.jsonApiService
      .get<SubjectJsonApi>(`${this.apiUrl}/subjects/${id}/children/?page[size]=150&sort=text&related_counts=children`)
      .pipe(map((response) => SubjectMapper.mapSubjects(response.data)));
  }

  getProjectSubjects(projectId: string) {
    return this.jsonApiService
      .get<SubjectJsonApi>(`${this.apiUrl}/nodes/${projectId}/subjects/`)
      .pipe(map((response) => SubjectMapper.mapSubjects(response.data)));
  }

  getSubjects(): Observable<NodeSubjectModel[]> {
    return this.jsonApiService
      .get<SubjectJsonApi>(`${this.apiUrl}/subjects/?page[size]=150&embed=parent`)
      .pipe(map((response) => SubjectMapper.mapSubjectsResponse(response.data)));
  }

  updateProjectSubjects(projectId: string, subjectIds: string[]): Observable<UpdateSubjectRequestJsonApi[]> {
    const payload = {
      data: subjectIds.map((id) => ({
        type: 'subjects',
        id,
      })),
    };

    return this.jsonApiService.put<UpdateSubjectRequestJsonApi[]>(
      `${this.apiUrl}/nodes/${projectId}/relationships/subjects/`,
      payload
    );
  }
}
