import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

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

  getProjectChildren(id: string): Observable<Project[]> {
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${environment.apiUrl}/nodes/${id}/children/`)
      .pipe(map((response) => ProjectsMapper.fromGetAllProjectsResponse(response)));
  }

  getComponentsTree(id: string): Observable<Project[]> {
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
