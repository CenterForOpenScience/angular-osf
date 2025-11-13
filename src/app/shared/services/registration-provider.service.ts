import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { RegistrationProviderMapper } from '../mappers/registration-provider.mapper';
import { JsonApiResponse } from '../models/common/json-api.model';
import { ProvidersResponseJsonApi } from '../models/provider/providers-json-api.model';
import { RegistryProviderDetailsJsonApi } from '../models/provider/registration-provider-json-api.model';
import { RegistryProviderDetails } from '../models/provider/registry-provider.model';
import { ProviderSchema } from '../models/registration/provider-schema.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationProviderService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getProviderSchemas(providerId: string): Observable<ProviderSchema[]> {
    const params = {
      'page[size]': 100,
    };
    return this.jsonApiService
      .get<ProvidersResponseJsonApi>(`${this.apiUrl}/providers/registrations/${providerId}/schemas/`, params)
      .pipe(map((response) => RegistrationProviderMapper.fromProvidersResponse(response)));
  }

  getProviderBrand(providerName: string): Observable<RegistryProviderDetails> {
    return this.jsonApiService
      .get<
        JsonApiResponse<RegistryProviderDetailsJsonApi, null>
      >(`${this.apiUrl}/providers/registrations/${providerName}/?embed=brand`)
      .pipe(map((response) => RegistrationProviderMapper.fromRegistryProvider(response.data)));
  }
}
