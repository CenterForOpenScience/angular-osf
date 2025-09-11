import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { RegistryProviderDetailsJsonApi } from '@osf/features/registries/models/registry-provider-json-api.model';
import { ProvidersResponseJsonApi } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';
import { JsonApiResponse } from '@shared/models';

import { ProvidersMapper } from '../mappers/providers.mapper';
import { ProviderSchema } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

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
