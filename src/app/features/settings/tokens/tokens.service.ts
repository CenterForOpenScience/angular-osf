import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Observable } from 'rxjs';
import { Scope } from '@core/store/settings';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/';

  getScopes(): Observable<Scope[]> {
    return this.jsonApiService.getArray<Scope>(this.baseUrl + 'scopes');
  }
}
