import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ComponentsMapper } from '@osf/shared/mappers/components';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { InstitutionsMapper } from '@osf/shared/mappers/institutions';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { BaseNodeMapper } from '@osf/shared/mappers/nodes';
import { NodePreprintMapper } from '@osf/shared/mappers/nodes/node-preprint.mapper';
import { NodeStorageMapper } from '@osf/shared/mappers/nodes/node-storage.mapper';
import { JsonApiResponse, ResponseJsonApi } from '@osf/shared/models/common/json-api.model';
import { ComponentGetResponseJsonApi } from '@osf/shared/models/components/component-json-api.model';
import { ComponentOverview } from '@osf/shared/models/components/components.models';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';
import { InstitutionsJsonApiResponse } from '@osf/shared/models/institutions/institution-json-api.model';
import { LicenseResponseJsonApi } from '@osf/shared/models/license/licenses-json-api.model';
import { BaseNodeModel } from '@osf/shared/models/nodes/base-node.model';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';
import { NodePreprintsResponseJsonApi } from '@osf/shared/models/nodes/node-preprint-json-api.model';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { NodeStorageResponseJsonApi } from '@osf/shared/models/nodes/node-storage-json-api.model';
import { NodeResponseJsonApi } from '@osf/shared/models/nodes/nodes-json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';
import { Institution } from '@shared/models/institutions/institutions.models';
import { LicenseModel } from '@shared/models/license/license.model';

import { ProjectOverviewMapper } from '../mappers';
import { PrivacyStatusModel, ProjectOverviewWithMeta } from '../models';
import { ParentProjectModel } from '../models/parent-overview.model';

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
    const params: Record<string, unknown> = { related_counts: 'forks,view_only_links' };

    return this.jsonApiService.get<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params).pipe(
      map((response) => ({
        project: ProjectOverviewMapper.getProjectOverview(response.data),
        meta: response.meta,
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

  getProjectLicense(licenseId: string): Observable<LicenseModel | null> {
    return this.jsonApiService
      .get<LicenseResponseJsonApi>(`${this.apiUrl}/licenses/${licenseId}/`)
      .pipe(map((response) => LicensesMapper.fromLicenseDataJsonApi(response.data)));
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

    const headers = {
      'Content-Type': 'application/vnd.api+json; ext=bulk',
    };

    return this.jsonApiService
      .patch<BaseNodeDataJsonApi[]>(`${this.apiUrl}/nodes/`, payload, undefined, headers)
      .pipe(map((res) => BaseNodeMapper.getNodesData(res)));
  }

  forkResource(projectId: string, resourceType: string): Observable<void> {
    const payload = {
      data: {
        type: 'nodes',
      },
    };

    return this.jsonApiService.post<void>(`${this.apiUrl}/${resourceType}/${projectId}/forks/`, payload);
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
      .post<JsonApiResponse<BaseNodeDataJsonApi, null>>(`${this.apiUrl}/nodes/`, payload)
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
      .post<JsonApiResponse<BaseNodeDataJsonApi, null>>(`${this.apiUrl}/nodes/${projectId}/children/`, payload, params)
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

  deleteComponent(componentId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/nodes/${componentId}/`);
  }

  getComponents(projectId: string, page = 1, pageSize = 10): Observable<PaginatedData<ComponentOverview[]>> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<ResponseJsonApi<ComponentGetResponseJsonApi[]>>(`${this.apiUrl}/nodes/${projectId}/children/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item)),
          totalCount: response.meta?.total || 0,
          pageSize: response.meta?.per_page || pageSize,
        }))
      );
  }

  getParentProject(projectId: string): Observable<ParentProjectModel> {
    const params: Record<string, unknown> = { 'embed[]': ['bibliographic_contributors'] };

    const context = new HttpContext();
    context.set(BYPASS_ERROR_INTERCEPTOR, true);

    return this.jsonApiService
      .get<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params, context)
      .pipe(map((response) => ProjectOverviewMapper.getParentOverview(response.data)));
  }
}
