import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ProjectsMapper } from '../mappers/projects';
import { ProjectJsonApi, ProjectMetadataUpdatePayload, ProjectModel, ProjectsResponseJsonApi } from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  fetchProjects(userId: string, params?: Record<string, unknown>): Observable<ProjectModel[]> {
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${this.apiUrl}/users/${userId}/nodes/`, params)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }

  updateProjectMetadata(metadata: ProjectMetadataUpdatePayload): Observable<ProjectModel> {
    const payload = ProjectsMapper.toUpdateProjectRequest(metadata);

    return this.jsonApiService
      .patch<ProjectJsonApi>(`${this.apiUrl}/nodes/${metadata.id}/`, payload)
      .pipe(map((response) => ProjectsMapper.fromProjectResponse(response)));
  }

  getProjectChildren(id: string): Observable<ProjectModel[]> {
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${this.apiUrl}/nodes/${id}/children/`)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }

  getComponentsTree(id: string): Observable<ProjectModel[]> {
    return this.getProjectChildren(id).pipe(
      switchMap((children) => {
        if (!children.length) {
          return of([]);
        }
        const childrenWithSubtrees$ = children.map((child) =>
          this.getComponentsTree(child.id).pipe(
            map((subChildren) => ({
              ...child,
              children: subChildren,
            }))
          )
        );

        return childrenWithSubtrees$.length ? forkJoin(childrenWithSubtrees$) : of([]);
      })
    );
  }
}
