import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { ProjectMetadataMapper } from '@osf/features/project/metadata/mappers/project-metadata.mapper';
import {
  CedarMetadataRecord,
  CedarMetadataRecordJsonApi,
  CedarMetadataTemplateJsonApi,
} from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';

import { environment } from '../../../../../environments/environment';
import {
  CrossRefFundersResponse,
  CustomItemMetadataRecord,
  CustomItemMetadataResponse,
  UserInstitutionsResponse,
} from '../models/metadata.models';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;

  getCustomItemMetadata(guid: string): Observable<CustomItemMetadataResponse> {
    return this.jsonApiService.get<CustomItemMetadataResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`);
  }

  updateCustomItemMetadata(guid: string, metadata: CustomItemMetadataRecord): Observable<CustomItemMetadataResponse> {
    return this.jsonApiService.put<CustomItemMetadataResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`, {
      data: {
        type: 'custom-item-metadata-records',
        attributes: metadata,
      },
    });
  }

  getFundersList(searchQuery?: string): Observable<CrossRefFundersResponse> {
    let url = `https://api.crossref.org/funders?mailto=support@osf.io`;

    if (searchQuery && searchQuery.trim()) {
      url += `&query=${encodeURIComponent(searchQuery.trim())}`;
    }

    return this.jsonApiService.get<CrossRefFundersResponse>(url);
  }

  getMetadataCedarTemplates(url?: string): Observable<CedarMetadataTemplateJsonApi> {
    return this.jsonApiService.get<CedarMetadataTemplateJsonApi>(
      url || 'https://api.staging4.osf.io/_/cedar_metadata_templates/'
    );
  }

  getMetadataCedarRecords(projectId: string): Observable<CedarMetadataRecordJsonApi> {
    const params: Record<string, unknown> = {
      embed: 'template',
      'page[size]': 20,
    };

    return this.jsonApiService.get<CedarMetadataRecordJsonApi>(
      `${this.apiUrl}/nodes/${projectId}/cedar_metadata_records/`,
      params
    );
  }

  createMetadataCedarRecord(data: CedarMetadataRecord): Observable<CedarMetadataRecord> {
    return this.jsonApiService.post<CedarMetadataRecord>(`https://api.staging4.osf.io/_/cedar_metadata_records/`, data);
  }

  updateMetadataCedarRecord(data: CedarMetadataRecord, recordId: string): Observable<CedarMetadataRecord> {
    return this.jsonApiService.patch<CedarMetadataRecord>(
      `https://api.staging4.osf.io/_/cedar_metadata_records/${recordId}/`,
      data
    );
  }

  getProjectForMetadata(projectId: string): Observable<ProjectOverview> {
    const params: Record<string, unknown> = {
      'embed[]': ['contributors', 'affiliated_institutions', 'identifiers', 'license', 'subjects_acceptable'],
      'fields[institutions]': 'assets,description,name',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      'fields[subjects]': 'text,taxonomy',
    };

    return this.jsonApiService
      .get<{ data: Record<string, unknown> }>(`${environment.apiUrl}/nodes/${projectId}/`, params)
      .pipe(map((response) => ProjectMetadataMapper.fromMetadataApiResponse(response.data)));
  }

  updateProjectDetails(
    projectId: string,
    updates: Partial<{
      title: string;
      description: string;
      tags: string[];
      category: string;
      node_license?: {
        id: string;
      };
    }>
  ): Observable<ProjectOverview> {
    const payload = {
      data: {
        id: projectId,
        type: 'nodes',
        attributes: updates,
      },
    };

    return this.jsonApiService
      .patch<Record<string, unknown>>(`${this.apiUrl}/nodes/${projectId}`, payload)
      .pipe(
        map((response) => ProjectMetadataMapper.fromMetadataApiResponse(response['data'] as Record<string, unknown>))
      );
  }

  getUserInstitutions(userId: string, page = 1, pageSize = 10): Observable<UserInstitutionsResponse> {
    const params = {
      page: page.toString(),
      'page[size]': pageSize.toString(),
    };

    return this.jsonApiService.get<UserInstitutionsResponse>(`${this.apiUrl}/users/${userId}/institutions/`, {
      params,
    });
  }
}
