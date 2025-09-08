import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProjectsMapper } from '@osf/shared/mappers/projects';
import { ProjectsResponseJsonApi } from '@osf/shared/models/projects';
import { JsonApiService } from '@osf/shared/services';

import { Project } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  getProjects(): Observable<Project[]> {
    const params: Record<string, unknown> = {
      'filter[current_user_permissions]': 'admin',
    };
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${this.apiUrl}/users/me/nodes/`, params)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }
}
