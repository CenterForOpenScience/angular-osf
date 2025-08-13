import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProjectsMapper } from '@shared/mappers/projects';
import { ProjectMetadataUpdatePayload } from '@shared/models';
import { Project, ProjectJsonApi, ProjectsResponseJsonApi } from '@shared/models/projects';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private jsonApiService = inject(JsonApiService);

  fetchProjects(userId: string, params?: Record<string, unknown>): Observable<Project[]> {
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${environment.apiUrl}/users/${userId}/nodes/`, params)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }

  updateProjectMetadata(metadata: ProjectMetadataUpdatePayload): Observable<Project> {
    const payload = ProjectsMapper.toUpdateProjectRequest(metadata);

    return this.jsonApiService
      .patch<ProjectJsonApi>(`${environment.apiUrl}/nodes/${metadata.id}/`, payload)
      .pipe(map((response) => ProjectsMapper.fromProjectResponse(response)));
  }
}
