import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { RegionsMapper } from '../mappers/regions';
import { IdName, RegionsResponseJsonApi } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getAllRegions(): Observable<IdName[]> {
    return this.http
      .get<RegionsResponseJsonApi>(`${this.apiUrl}/regions/`)
      .pipe(map((regions) => RegionsMapper.fromRegionsResponseJsonApi(regions)));
  }
}
