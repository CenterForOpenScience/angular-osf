import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@osf/shared/enums';
import { Identifier, LicenseOptions } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { CedarRecordsMapper, MetadataMapper } from '../mappers';
import {
  CedarMetadataRecord,
  CedarMetadataRecordJsonApi,
  CedarMetadataTemplateJsonApi,
  CedarRecordDataBinding,
  CustomMetadataJsonApi,
  CustomMetadataJsonApiResponse,
  MetadataAttributesJsonApi,
  MetadataJsonApi,
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
    [ResourceType.File, 'files'],
  ]);

  getCustomItemMetadata(guid: string): Observable<CustomItemMetadataRecord> {
    return this.jsonApiService
      .get<CustomMetadataJsonApiResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`)
      .pipe(map((response) => MetadataMapper.fromCustomMetadataApiResponse(response.data)));
  }

  updateCustomItemMetadata(guid: string, metadata: CustomItemMetadataRecord): Observable<CustomItemMetadataRecord> {
    const payload = MetadataMapper.toCustomMetadataApiRequest(guid, metadata);

    return this.jsonApiService
      .put<CustomMetadataJsonApi>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`, payload)
      .pipe(map((response) => MetadataMapper.fromCustomMetadataApiResponse(response)));
  }

  createDoi(resourceId: string, resourceType: ResourceType): Observable<Identifier> {
    const payload = {
      data: {
        type: 'identifiers',
        attributes: {
          category: 'doi',
        },
      },
    };

    return this.jsonApiService.post(
      `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/identifiers/`,
      payload
    );
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

  getMetadataCedarRecords(resourceId: string, resourceType: ResourceType): Observable<CedarMetadataRecordJsonApi> {
    const params: Record<string, unknown> = {
      embed: 'template',
      'page[size]': 20,
    };

    return this.jsonApiService.get<CedarMetadataRecordJsonApi>(
      `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/cedar_metadata_records/`,
      params
    );
  }

  createMetadataCedarRecord(
    data: CedarRecordDataBinding,
    resourceId: string,
    resourceType: ResourceType
  ): Observable<CedarMetadataRecord> {
    const payload = CedarRecordsMapper.toCedarRecordsPayload(data, resourceId, this.urlMap.get(resourceType) as string);
    return this.jsonApiService.post<CedarMetadataRecord>(
      `${environment.apiDomainUrl}/_/cedar_metadata_records/`,
      payload
    );
  }

  updateMetadataCedarRecord(
    data: CedarRecordDataBinding,
    recordId: string,
    resourceId: string,
    resourceType: ResourceType
  ): Observable<CedarMetadataRecord> {
    const payload = CedarRecordsMapper.toCedarRecordsPayload(data, resourceId, this.urlMap.get(resourceType) as string);

    return this.jsonApiService.patch<CedarMetadataRecord>(
      `${environment.apiDomainUrl}/_/cedar_metadata_records/${recordId}/`,
      payload
    );
  }

  getResourceMetadata(resourceId: string, resourceType: ResourceType): Observable<Partial<Metadata>> {
    const params = this.getMetadataParams(resourceType);

    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/`;
    return this.jsonApiService
      .get<MetadataJsonApiResponse>(baseUrl, params)
      .pipe(map((response) => MetadataMapper.fromMetadataApiResponse(response.data)));
  }

  updateResourceDetails(
    resourceId: string,
    resourceType: ResourceType,
    updates: Partial<MetadataAttributesJsonApi>
  ): Observable<Metadata> {
    const payload = {
      data: {
        id: resourceId,
        type: this.urlMap.get(resourceType),
        attributes: updates,
      },
    };

    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/`;
    const params = this.getMetadataParams(resourceType);

    return this.jsonApiService
      .patch<MetadataJsonApi>(baseUrl, payload, params)
      .pipe(map((response) => MetadataMapper.fromMetadataApiResponse(response)));
  }

  updateResourceLicense(
    resourceId: string,
    resourceType: ResourceType,
    licenseId: string,
    licenseOptions?: LicenseOptions
  ): Observable<Metadata> {
    const payload = {
      data: {
        id: resourceId,
        type: this.urlMap.get(resourceType),
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          ...(licenseOptions && {
            node_license: {
              copyright_holders: [licenseOptions.copyrightHolders],
              year: licenseOptions.year,
            },
          }),
        },
      },
    };

    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/`;
    const params = this.getMetadataParams(resourceType);

    return this.jsonApiService
      .patch<MetadataJsonApi>(baseUrl, payload, params)
      .pipe(map((response) => MetadataMapper.fromMetadataApiResponse(response)));
  }

  private getMetadataParams(resourceType: ResourceType): Record<string, unknown> {
    const params = {
      embed: ['affiliated_institutions', 'identifiers', 'license', 'bibliographic_contributors'],
    };

    if (resourceType === ResourceType.Registration) {
      params['embed'].push('provider');
    }

    return params;
  }
}
