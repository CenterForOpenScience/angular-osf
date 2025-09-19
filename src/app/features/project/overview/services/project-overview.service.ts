import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ComponentsMapper } from '@osf/shared/mappers';
import { ComponentGetResponseJsonApi, ComponentOverview, JsonApiResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { ProjectOverviewMapper } from '../mappers';
import { ProjectOverviewResponseJsonApi, ProjectOverviewWithMeta } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProjectOverviewService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getProjectById(projectId: string): Observable<ProjectOverviewWithMeta> {
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

    return this.jsonApiService.get<ProjectOverviewResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params).pipe(
      map((response) => ({
        project: ProjectOverviewMapper.fromGetProjectResponse(response.data),
        meta: response.meta,
      }))
    );
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

    return this.jsonApiService.patch<void>(`${this.apiUrl}/nodes/${projectId}/`, payload);
  }

  forkResource(projectId: string, resourceType: string): Observable<void> {
    const payload = {
      data: {
        type: 'nodes',
      },
    };

    return this.jsonApiService.post<void>(`${this.apiUrl}/${resourceType}/${projectId}/forks/`, payload);
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

    return this.jsonApiService.post<void>(`${this.apiUrl}/nodes/`, payload);
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

    return this.jsonApiService.post<void>(`${this.apiUrl}/nodes/${projectId}/children/`, payload, params);
  }

  deleteComponent(componentId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/nodes/${componentId}/`);
  }

  getComponents(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .get<JsonApiResponse<ComponentGetResponseJsonApi[], null>>(`${this.apiUrl}/nodes/${projectId}/children/`, params)
      .pipe(map((response) => response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item))));
  }
}
