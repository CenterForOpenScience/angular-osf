import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { ProjectsMapper } from '@shared/mappers/projects';
import { Project, ProjectsGetResponseJsonApi } from '@shared/models/projects';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private jsonApiService = inject(JsonApiService);

  getAdminProjects(userId: string): Observable<Project[]> {
    const params: Record<string, string> = {
      'filter[current_user_permissions]': 'admin',
    };

    return this.jsonApiService
      .get<ProjectsGetResponseJsonApi>(`${environment.apiUrl}/users/${userId}/nodes/`, params)
      .pipe(map((response) => ProjectsMapper.fromGetProjectsResponse(response)));
  }
}
