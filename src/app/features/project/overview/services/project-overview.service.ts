import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { ProjectOverviewMapper } from '../mappers';
import {
  ComponentGetResponseJsoApi,
  ComponentOverview,
  ProjectOverview,
  ProjectOverviewResponseJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectOverviewService {
  #jsonApiService = inject(JsonApiService);

  getProjectById(projectId: string): Observable<ProjectOverview> {
    const params: Record<string, unknown> = {
      'embed[]': [
        'bibliographic_contributors',
        'affiliated_institutions',
        'identifiers',
        'license',
        'storage',
        'preprints',
      ],
      'fields[institutions]': 'assets,description,name',
      'fields[preprints]': 'title,date_created',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      related_counts: 'forks,view_only_links',
    };

    return this.#jsonApiService
      .get<ProjectOverviewResponseJsonApi>(`${environment.apiUrl}/nodes/${projectId}/`, params)
      .pipe(map((response) => ProjectOverviewMapper.fromGetProjectResponse(response.data)));
  }

  updateProjectPublicStatus(projectId: string, isPublic: boolean): Observable<void> {
    const payload = {
      data: {
        id: projectId,
        type: 'nodes',
        attributes: {
          public: isPublic,
        },
      },
    };

    return this.#jsonApiService.patch<void>(`${environment.apiUrl}/nodes/${projectId}/`, payload);
  }

  forkResource(projectId: string, resourceType: string): Observable<void> {
    const payload = {
      data: {
        type: 'nodes',
      },
    };

    return this.#jsonApiService.post<void>(`${environment.apiUrl}/${resourceType}/${projectId}/forks/`, payload);
  }

  duplicateProject(projectId: string, title: string): Observable<void> {
    const payload = {
      data: {
        type: 'nodes',
        attributes: {
          template_from: projectId,
          category: 'project',
          title: 'Templated from ' + title,
        },
      },
    };

    return this.#jsonApiService.post<void>(`${environment.apiUrl}/nodes/`, payload);
  }

  createComponent(
    projectId: string,
    title: string,
    description: string | null,
    tags: string[],
    region: string | null,
    affiliatedInstitutions: string[],
    inheritContributors: boolean
  ): Observable<void> {
    const payload = {
      data: {
        type: 'nodes',
        attributes: {
          title,
          category: 'project',
          description: description || '',
          tags,
        },
      },
    };

    const params: Record<string, unknown> = {
      inherit_contributors: inheritContributors,
    };

    if (region) {
      params['region'] = region;
    }

    if (affiliatedInstitutions.length) {
      params['affiliated_institutions'] = affiliatedInstitutions;
    }

    return this.#jsonApiService.post<void>(`${environment.apiUrl}/nodes/${projectId}/children/`, payload, params);
  }

  deleteComponent(componentId: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.apiUrl}/nodes/${componentId}/`);
  }

  getComponents(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.#jsonApiService
      .get<{ data: ComponentGetResponseJsoApi[] }>(`${environment.apiUrl}/nodes/${projectId}/children`, params)
      .pipe(map((response) => response.data.map((item) => ProjectOverviewMapper.fromGetComponentResponse(item))));
  }

  getLinkedProjects(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.#jsonApiService
      .get<{ data: ComponentGetResponseJsoApi[] }>(`${environment.apiUrl}/nodes/${projectId}/linked_nodes`, params)
      .pipe(map((response) => response.data.map((item) => ProjectOverviewMapper.fromGetComponentResponse(item))));
  }
}
