import { map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { bypassErrorInterceptorContext } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JSON_API_BULK_HEADERS } from '@osf/shared/constants/json-api-headers.const';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { InstitutionsMapper } from '@osf/shared/mappers/institutions';
import { BaseNodeMapper } from '@osf/shared/mappers/nodes';
import { NodePreprintMapper } from '@osf/shared/mappers/nodes/node-preprint.mapper';
import { NodeStorageMapper } from '@osf/shared/mappers/nodes/node-storage.mapper';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';
import { InstitutionsJsonApiResponse } from '@osf/shared/models/institutions/institution-json-api.model';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { BaseNodeModel, NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';
import { NodePreprintsResponseJsonApi } from '@osf/shared/models/nodes/node-preprint-json-api.model';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { NodeStorageResponseJsonApi } from '@osf/shared/models/nodes/node-storage-json-api.model';
import { NodeResponseJsonApi, NodesResponseJsonApi } from '@osf/shared/models/nodes/nodes-json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';

import { ProjectOverviewMapper } from '../mappers';
import { PrivacyStatusModel, ProjectOverviewModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProjectOverviewService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getProjectById(projectId: string): Observable<PaginatedData<ProjectOverviewModel>> {
    const params: Record<string, unknown> = { related_counts: 'forks,view_only_links' };

    return this.jsonApiService.get<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params).pipe(
      map((response) => ({
        data: ProjectOverviewMapper.getProjectOverview(response.data),
        totalCount: 1,
        pageSize: 1,
        isAnonymous: response.meta?.anonymous ?? false,
      }))
    );
  }

  getProjectInstitutions(projectId: string): Observable<Institution[]> {
    const params = { 'page[size]': 100 };

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(`${this.apiUrl}/nodes/${projectId}/institutions/`, params)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  getProjectIdentifiers(projectId: string): Observable<IdentifierModel[]> {
    return this.jsonApiService
      .get<IdentifiersResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/identifiers/`)
      .pipe(map((response) => IdentifiersMapper.fromJsonApi(response)));
  }

  getProjectStorage(projectId: string): Observable<NodeStorageModel> {
    return this.jsonApiService
      .get<NodeStorageResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/storage/`)
      .pipe(map((response) => NodeStorageMapper.getNodeStorage(response.data)));
  }

  getProjectPreprints(projectId: string): Observable<NodePreprintModel[]> {
    return this.jsonApiService
      .get<NodePreprintsResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/preprints/`)
      .pipe(map((response) => NodePreprintMapper.getNodePreprints(response.data)));
  }

  updateProjectPublicStatus(data: PrivacyStatusModel[]): Observable<BaseNodeModel[]> {
    const payload = {
      data: data.map((item) => ({ id: item.id, type: 'nodes', attributes: { public: item.public } })),
    };

    return this.jsonApiService
      .patch<BaseNodeDataJsonApi[]>(`${this.apiUrl}/nodes/`, payload, undefined, JSON_API_BULK_HEADERS)
      .pipe(map((res) => BaseNodeMapper.getNodesData(res)));
  }

  duplicateProject(projectId: string, title: string): Observable<BaseNodeModel> {
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

    return this.jsonApiService
      .post<NodeResponseJsonApi>(`${this.apiUrl}/nodes/`, payload)
      .pipe(map((response) => BaseNodeMapper.getNodeData(response.data)));
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

    return this.jsonApiService
      .post<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/children/`, payload, params)
      .pipe(
        switchMap((response) => {
          const componentId = response.data.id;

          if (affiliatedInstitutions.length) {
            const affiliationsPayload = {
              data: affiliatedInstitutions.map((id) => ({
                type: 'institutions',
                id,
              })),
            };

            return this.jsonApiService.patch<void>(
              `${this.apiUrl}/nodes/${componentId}/relationships/institutions/`,
              affiliationsPayload
            );
          }

          return of(undefined);
        })
      );
  }

  getComponents(projectId: string, page = 1, pageSize = 10): Observable<PaginatedData<NodeModel[]>> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      page: page,
      'page[size]': pageSize,
      sort: '_order',
    };

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/children/`, params)
      .pipe(map((response) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(response)));
  }

  getParentProject(projectId: string): Observable<NodeModel> {
    const params: Record<string, unknown> = { 'embed[]': ['bibliographic_contributors'] };

    return this.jsonApiService
      .get<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params, bypassErrorInterceptorContext())
      .pipe(map((response) => BaseNodeMapper.getNodeWithEmbedContributors(response.data)));
  }

  reorderComponents(projectId: string, componentIds: string[]): Observable<void> {
    const payload = {
      data: componentIds.map((id, index) => ({
        type: 'nodes',
        id,
        attributes: {
          _order: index,
        },
      })),
    };

    return this.jsonApiService.patch<void>(
      `${this.apiUrl}/nodes/${projectId}/reorder_components/`,
      payload,
      undefined,
      JSON_API_BULK_HEADERS
    );
  }
}
