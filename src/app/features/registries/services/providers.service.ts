import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@osf/core/services';
import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { RegistryProviderDetailsJsonApi } from '@osf/features/registries/models/registry-provider-json-api.model';

import { ProvidersMapper } from '../mappers/providers.mapper';
import { ProviderSchema } from '../models';
import { ProvidersResponseJsonApi } from '../models/providers-json-api.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getProviderSchemas(providerId: string): Observable<ProviderSchema[]> {
    return this.jsonApiService
      .get<ProvidersResponseJsonApi>(`${this.apiUrl}/providers/registrations/${providerId}/schemas/`)
      .pipe(map((response) => ProvidersMapper.fromProvidersResponse(response)));
  }

  getProviderBrand(providerName: string): Observable<RegistryProviderDetails> {
    return this.jsonApiService
      .get<
        JsonApiResponse<RegistryProviderDetailsJsonApi, null>
      >(`${this.apiUrl}/providers/registrations/${providerName}/?embed=brand`)
      .pipe(map((response) => ProvidersMapper.fromRegistryProvider(response.data)));
  }
}
