import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import {
  CedarMetadataRecord,
  CedarMetadataRecordJsonApi,
  CedarMetadataTemplateJsonApi,
} from '@osf/features/project/metadata/models';
import { License } from '@shared/models';

import { RegistryMetadataMapper } from '../mappers';
import {
  BibliographicContributorsJsonApi,
  CustomItemMetadataRecord,
  CustomItemMetadataResponse,
  RegistryContributorAddRequest,
  RegistryContributorJsonApiResponse,
  RegistryContributorUpdateRequest,
  RegistryInstitutionsJsonApiResponse,
  RegistryOverview,
  RegistrySubjectsJsonApi,
  UserInstitutionsResponse,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryMetadataService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;

  getBibliographicContributors(
    registryId: string,
    page = 1,
    pageSize = 100
  ): Observable<BibliographicContributorsJsonApi> {
    const params: Record<string, unknown> = {
      'fields[contributors]': 'index,users',
      'fields[users]': 'full_name',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService.get<BibliographicContributorsJsonApi>(
      `${this.apiUrl}/registrations/${registryId}/bibliographic_contributors/`,
      params
    );
  }

  getCustomItemMetadata(guid: string): Observable<CustomItemMetadataResponse> {
    return this.jsonApiService.get<CustomItemMetadataResponse>(`${this.apiUrl}/custom_item_metadata_records/${guid}/`);
  }

  updateCustomItemMetadata(guid: string, metadata: CustomItemMetadataRecord): Observable<CustomItemMetadataResponse> {
    return this.jsonApiService.patch<CustomItemMetadataResponse>(
      `${this.apiUrl}/custom_item_metadata_records/${guid}/`,
      {
        data: {
          id: guid,
          type: 'custom-item-metadata-records',
          attributes: metadata,
          relationships: {},
        },
      }
    );
  }

  getRegistryForMetadata(registryId: string): Observable<RegistryOverview> {
    const params: Record<string, unknown> = {
      'embed[]': ['contributors', 'affiliated_institutions', 'identifiers', 'license', 'subjects_acceptable'],
      'fields[institutions]': 'assets,description,name',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      'fields[subjects]': 'text,taxonomy',
    };

    return this.jsonApiService
      .get<{ data: Record<string, unknown> }>(`${environment.apiUrl}/registrations/${registryId}/`, params)
      .pipe(map((response) => RegistryMetadataMapper.fromMetadataApiResponse(response.data)));
  }

  updateRegistryDetails(registryId: string, updates: Partial<Record<string, unknown>>): Observable<RegistryOverview> {
    const payload = {
      data: {
        id: registryId,
        type: 'registrations',
        attributes: updates,
      },
    };

    return this.jsonApiService
      .patch<Record<string, unknown>>(`${this.apiUrl}/registrations/${registryId}`, payload)
      .pipe(map((response) => RegistryMetadataMapper.fromMetadataApiResponse(response)));
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

  getRegistrySubjects(registryId: string, page = 1, pageSize = 100): Observable<RegistrySubjectsJsonApi> {
    const params: Record<string, unknown> = {
      'page[size]': pageSize,
      page: page,
    };

    return this.jsonApiService.get<RegistrySubjectsJsonApi>(
      `${this.apiUrl}/registrations/${registryId}/subjects/`,
      params
    );
  }

  getRegistryCedarMetadataRecords(registryId: string): Observable<CedarMetadataRecordJsonApi> {
    const params: Record<string, unknown> = {
      embed: 'template',
      'page[size]': 20,
    };

    return this.jsonApiService.get<CedarMetadataRecordJsonApi>(
      `${this.apiUrl}/registrations/${registryId}/cedar_metadata_records/`,
      params
    );
  }

  getCedarMetadataTemplates(url?: string): Observable<CedarMetadataTemplateJsonApi> {
    return this.jsonApiService.get<CedarMetadataTemplateJsonApi>(
      url || `${environment.apiDomainUrl}/_/cedar_metadata_templates/?adapterOptions[sort]=schema_name`
    );
  }

  createCedarMetadataRecord(data: CedarMetadataRecord): Observable<CedarMetadataRecord> {
    return this.jsonApiService.post<CedarMetadataRecord>(`${environment.apiDomainUrl}/_/cedar_metadata_records/`, data);
  }

  updateCedarMetadataRecord(data: CedarMetadataRecord, recordId: string): Observable<CedarMetadataRecord> {
    return this.jsonApiService.patch<CedarMetadataRecord>(
      `${environment.apiDomainUrl}/_/cedar_metadata_records/${recordId}/`,
      data
    );
  }

  updateRegistrySubjects(
    registryId: string,
    subjects: { type: string; id: string }[]
  ): Observable<{ data: { type: string; id: string }[] }> {
    return this.jsonApiService.patch<{ data: { type: string; id: string }[] }>(
      `${this.apiUrl}/registrations/${registryId}/relationships/subjects/`,
      {
        data: subjects,
      }
    );
  }

  updateRegistryInstitutions(
    registryId: string,
    institutions: { type: string; id: string }[]
  ): Observable<{ data: { type: string; id: string }[] }> {
    return this.jsonApiService.patch<{ data: { type: string; id: string }[] }>(
      `${this.apiUrl}/registrations/${registryId}/relationships/institutions/`,
      {
        data: institutions,
      }
    );
  }

  getLicenseFromUrl(licenseUrl: string): Observable<License> {
    return this.jsonApiService.get<{ data: Record<string, unknown> }>(licenseUrl).pipe(
      map((response) => {
        const licenseData = response.data;
        const attributes = licenseData['attributes'] as Record<string, unknown>;

        return {
          id: licenseData['id'] as string,
          name: attributes['name'] as string,
          text: attributes['text'] as string,
          url: attributes['url'] as string,
          requiredFields: (attributes['required_fields'] as string[]) || [],
        } as License;
      })
    );
  }

  getRegistryInstitutions(
    registryId: string,
    page = 1,
    pageSize = 100
  ): Observable<RegistryInstitutionsJsonApiResponse> {
    const params: Record<string, unknown> = {
      'fields[institutions]': 'name',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService.get(`${this.apiUrl}/registrations/${registryId}/institutions/`, params);
  }

  updateRegistryContributor(
    registryId: string,
    contributorId: string,
    updateData: RegistryContributorUpdateRequest
  ): Observable<RegistryContributorJsonApiResponse> {
    return this.jsonApiService.patch<RegistryContributorJsonApiResponse>(
      `${this.apiUrl}/registrations/${registryId}/contributors/${contributorId}/`,
      updateData
    );
  }

  addRegistryContributor(
    registryId: string,
    contributorData: RegistryContributorAddRequest
  ): Observable<RegistryContributorJsonApiResponse> {
    return this.jsonApiService.post<RegistryContributorJsonApiResponse>(
      `${this.apiUrl}/registrations/${registryId}/contributors/`,
      contributorData
    );
  }
}
