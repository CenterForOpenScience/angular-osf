import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';

import { ProjectsMapper } from '../mappers/projects.mapper';
import { Project } from '../models';
import { ProjectsResponseJsonApi } from '../models/projects-json-api.model';

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
      .pipe(map((response) => ProjectsMapper.fromProjectsResponse(response)));
  }

  getProjectChildren(id: string): Observable<Project[]> {
    return this.jsonApiService
      .get<ProjectsResponseJsonApi>(`${this.apiUrl}/nodes/${id}/children`)
      .pipe(map((response) => ProjectsMapper.fromProjectsResponse(response)));
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
