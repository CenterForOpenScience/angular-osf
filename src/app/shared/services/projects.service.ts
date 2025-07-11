import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { CollectionSubmissionMetadataPayloadJsonApi } from '@osf/features/collections/models';
import { ProjectsMapper } from '@shared/mappers/projects';
import { ProjectMetadataUpdatePayload } from '@shared/models';
import { Project, ProjectJsonApi, ProjectsResponseJsonApi } from '@shared/models/projects';

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
    const payload: CollectionSubmissionMetadataPayloadJsonApi = {
      data: {
        type: 'nodes',
        id: metadata.id,
        relationships: {
          license: {
            data: {
              id: metadata.licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          ...(metadata.licenseOptions && {
            node_license: {
              copyright_holders: [metadata.licenseOptions.copyrightHolders],
              year: metadata.licenseOptions.year,
            },
          }),
        },
      },
    };

    return this.jsonApiService
      .patch<ProjectJsonApi>(`${environment.apiUrl}/nodes/${metadata.id}/`, payload)
      .pipe(map((response) => ProjectsMapper.fromPatchProjectResponse(response)));
  }
}
