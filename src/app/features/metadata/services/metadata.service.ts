import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@osf/shared/enums';
import { JsonApiService } from '@osf/shared/services';

import { MetadataMapper } from '../mappers';
import {
  CedarMetadataRecord,
  CedarMetadataRecordJsonApi,
  CedarMetadataTemplateJsonApi,
  CustomMetadataJsonApiResponse,
  MetadataJsonApiResponse,
} from '../models';
import { CrossRefFundersResponse, CustomItemMetadataRecord, Metadata } from '../models/metadata.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;
  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getCustomItemMetadata(guid: string): Observable<CustomItemMetadataRecord> {
    return this.jsonApiService
      .get<CustomMetadataJsonApiResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`)
      .pipe(map((response) => MetadataMapper.fromCustomMetadataApiResponse(response)));
  }

  updateCustomItemMetadata(guid: string, metadata: CustomItemMetadataRecord): Observable<CustomItemMetadataRecord> {
    return this.jsonApiService
      .put<CustomMetadataJsonApiResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`, {
        data: {
          type: 'custom-item-metadata-records',
          attributes: metadata,
        },
      })
      .pipe(map((response) => MetadataMapper.fromCustomMetadataApiResponse(response)));
  }

  getFundersList(searchQuery?: string): Observable<CrossRefFundersResponse> {
    let url = `${environment.funderApiUrl}funders?mailto=support%40osf.io`;

    if (searchQuery && searchQuery.trim()) {
      url += `&query=${encodeURIComponent(searchQuery.trim())}`;
    }

    return this.jsonApiService.get<CrossRefFundersResponse>(url);
  }

  getMetadataCedarTemplates(url?: string): Observable<CedarMetadataTemplateJsonApi> {
    return this.jsonApiService.get<CedarMetadataTemplateJsonApi>(
      url || `${environment.apiDomainUrl}/_/cedar_metadata_templates/`
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
    return this.jsonApiService.post<CedarMetadataRecord>(`${environment.apiDomainUrl}/_/cedar_metadata_records/`, data);
  }

  updateMetadataCedarRecord(data: CedarMetadataRecord, recordId: string): Observable<CedarMetadataRecord> {
    return this.jsonApiService.patch<CedarMetadataRecord>(
      `https://api.staging4.osf.io/_/cedar_metadata_records/${recordId}/`,
      data
    );
  }

  getResourceMetadata(resourceId: string, resourceType: ResourceType): Observable<Partial<Metadata>> {
    // const params: Record<string, unknown> = {
    //   'embed[]': ['contributors', 'affiliated_institutions', 'identifiers', 'license', 'subjects_acceptable'],
    //   'fields[institutions]': 'assets,description,name',
    //   'fields[users]': 'family_name,full_name,given_name,middle_name',
    //   'fields[subjects]': 'text,taxonomy',
    // };
    const params = {
      embed: ['affiliated_institutions', 'identifiers', 'license', 'bibliographic_contributors'],
    };
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/`;
    return this.jsonApiService
      .get<MetadataJsonApiResponse>(baseUrl, params)
      .pipe(map((response) => MetadataMapper.fromMetadataApiResponse(response)));
  }

  // updateProjectDetails(projectId: string, updates: Partial<Metadata>): Observable<ProjectOverview> {
  //   const payload = {
  //     data: {
  //       id: projectId,
  //       type: 'nodes',
  //       attributes: updates,
  //     },
  //   };

  //   return this.jsonApiService
  //     .patch<Record<string, unknown>>(`${this.apiUrl}/nodes/${projectId}`, payload)
  //     .pipe(map((response) => MetadataUpdateMapper.fromMetadataApiResponse(response)));
  // }

  // getUserInstitutions(userId: string, page = 1, pageSize = 10): Observable<UserInstitutionsResponse> {
  //   const params = {
  //     page: page.toString(),
  //     'page[size]': pageSize.toString(),
  //   };

  //   return this.jsonApiService.get<UserInstitutionsResponse>(`${this.apiUrl}/users/${userId}/institutions/`, {
  //     params,
  //   });
  // }
}
