import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { RegistrationProviderMapper } from '../mappers';
import {
  JsonApiResponse,
  ProviderSchema,
  ProvidersResponseJsonApi,
  RegistryProviderDetails,
  RegistryProviderDetailsJsonApi,
} from '../models';

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
    return this.jsonApiService
      .get<ProvidersResponseJsonApi>(`${this.apiUrl}/providers/registrations/${providerId}/schemas/`)
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
