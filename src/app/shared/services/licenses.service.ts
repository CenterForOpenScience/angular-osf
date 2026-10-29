import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums/resource-type.enum';
import { LicensesMapper } from '../mappers/licenses.mapper';
import { LicenseModel } from '../models/license/license.model';
import { LicenseResponseJsonApi, LicensesResponseJsonApi } from '../models/license/licenses-json-api.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  get defaultProvider() {
    return this.environment.defaultProvider;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
    [ResourceType.Collection, 'collections'],
  ]);

  private readonly sortedProviderTypes = new Set<ResourceType>([ResourceType.Preprint, ResourceType.Collection]);

  getLicenses(resourceType: ResourceType, providerId = this.defaultProvider): Observable<LicenseModel[]> {
    const baseUrl =
      resourceType === ResourceType.Project
        ? `${this.apiUrl}/licenses/`
        : `${this.apiUrl}/providers/${this.urlMap.get(resourceType)}/${providerId}/licenses/`;

    const params: Record<string, unknown> = {
      'page[size]': 100,
    };

    if (this.sortedProviderTypes.has(resourceType)) {
      params['sort'] = 'name';
    }

    return this.jsonApiService
      .get<LicensesResponseJsonApi>(baseUrl, params)
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  getLicenseById(licenseId: string): Observable<LicenseModel | null> {
    return this.jsonApiService
      .get<LicenseResponseJsonApi>(`${this.apiUrl}/licenses/${licenseId}/`)
      .pipe(map((response) => LicensesMapper.fromLicenseDataJsonApi(response.data)));
  }
}
