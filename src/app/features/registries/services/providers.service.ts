import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

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
}
