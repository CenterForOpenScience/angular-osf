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
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getProjects(): Observable<Project[]> {
    const params: Record<string, unknown> = {
      'filter[current_user_permissions]': 'admin',
    };
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${this.apiUrl}/users/me/nodes/`, params)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }
}
