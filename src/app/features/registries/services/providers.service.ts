import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { ProvidersMapper } from '../mappers/providers.mapper';
import { Provider } from '../models';
import { ProvidersResponseJsonApi } from '../models/providers-json-api.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getProviders(): Observable<Provider[]> {
    return this.jsonApiService
      .get<ProvidersResponseJsonApi>(`${this.apiUrl}/providers/registrations/osf/schemas/`)
      .pipe(map((response) => ProvidersMapper.fromProvidersResponse(response)));
  }
}
