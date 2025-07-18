import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { RegionsMapper } from '@shared/mappers/regions';
import { IdName } from '@shared/models';
import { RegionsResponseJsonApi } from '@shared/models/regions';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllRegions(): Observable<IdName[]> {
    return this.http
      .get<RegionsResponseJsonApi>(`${this.baseUrl}/regions/`)
      .pipe(map((regions) => RegionsMapper.fromRegionsResponseJsonApi(regions)));
  }
}
