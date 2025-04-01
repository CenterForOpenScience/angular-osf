import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Observable } from 'rxjs';
import { Addon } from '@shared/entities/addons.entities';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/';

  getAddons(): Observable<Addon[]> {
    return this.jsonApiService.getArray(this.baseUrl + 'addons');
  }
}
