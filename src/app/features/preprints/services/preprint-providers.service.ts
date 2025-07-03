import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@core/services';
import { PreprintProvidersMapper } from '@osf/features/preprints/mappers';
import {
  PreprintProviderDetails,
  PreprintProviderDetailsJsonApi,
  PreprintProviderShortInfo,
} from '@osf/features/preprints/models';
import { Subject, SubjectsResponseJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintProvidersService {
  private jsonApiService = inject(JsonApiService);
  private baseUrl = `${environment.apiUrl}/providers/preprints/`;

  getPreprintProviderById(id: string): Observable<PreprintProviderDetails> {
    return this.jsonApiService
      .get<JsonApiResponse<PreprintProviderDetailsJsonApi, null>>(`${this.baseUrl}${id}/?embed=brand`)
      .pipe(
        map((response) => {
          return PreprintProvidersMapper.fromPreprintProviderDetailsGetResponse(response.data);
        })
      );
  }

  getPreprintProvidersToAdvertise(): Observable<PreprintProviderShortInfo[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<PreprintProviderDetailsJsonApi[], null>
      >(`${this.baseUrl}?filter[advertise_on_discover_page]=true&reload=true`)
      .pipe(
        map((response) => {
          return PreprintProvidersMapper.toPreprintProviderShortInfoFromGetResponse(
            response.data.filter((item) => !item.id.includes('osf'))
          );
        })
      );
  }

  getPreprintProvidersAllowingSubmissions(): Observable<PreprintProviderShortInfo[]> {
    return this.jsonApiService
      .get<JsonApiResponse<PreprintProviderDetailsJsonApi[], null>>(`${this.baseUrl}?filter[allow_submissions]=true`)
      .pipe(
        map((response) => {
          return PreprintProvidersMapper.toPreprintProviderShortInfoFromGetResponse(response.data);
        })
      );
  }

  getHighlightedSubjectsByProviderId(providerId: string): Observable<Subject[]> {
    return this.jsonApiService
      .get<SubjectsResponseJsonApi>(`${this.baseUrl}${providerId}/subjects/highlighted/?page[size]=20`)
      .pipe(
        map((response) => {
          return PreprintProvidersMapper.fromSubjectsGetResponse(response.data);
        })
      );
  }
}
