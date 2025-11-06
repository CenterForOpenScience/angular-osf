import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PreprintProvidersMapper } from '@osf/features/preprints/mappers';
import {
  PreprintProviderDetails,
  PreprintProviderDetailsJsonApi,
  PreprintProviderShortInfo,
} from '@osf/features/preprints/models';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { JsonApiResponse } from '@shared/models/common/json-api.model';
import { SubjectModel } from '@shared/models/subject/subject.model';
import { SubjectsResponseJsonApi } from '@shared/models/subject/subjects-json-api.model';

@Injectable({
  providedIn: 'root',
})
export class PreprintProvidersService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2/providers/preprints/`;
  }

  getPreprintProviderById(id: string): Observable<PreprintProviderDetails> {
    return this.jsonApiService
      .get<JsonApiResponse<PreprintProviderDetailsJsonApi, null>>(`${this.apiUrl}${id}/?embed=brand`)
      .pipe(map((response) => PreprintProvidersMapper.fromPreprintProviderDetailsGetResponse(response.data)));
  }

  getPreprintProvidersToAdvertise(): Observable<PreprintProviderShortInfo[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<PreprintProviderDetailsJsonApi[], null>
      >(`${this.apiUrl}?filter[advertise_on_discover_page]=true&reload=true`)
      .pipe(
        map((response) =>
          PreprintProvidersMapper.toPreprintProviderShortInfoFromGetResponse(
            response.data.filter((item) => !item.id.includes('osf'))
          )
        )
      );
  }

  getPreprintProvidersAllowingSubmissions(): Observable<PreprintProviderShortInfo[]> {
    return this.jsonApiService
      .get<JsonApiResponse<PreprintProviderDetailsJsonApi[], null>>(`${this.apiUrl}?filter[allow_submissions]=true`)
      .pipe(map((response) => PreprintProvidersMapper.toPreprintProviderShortInfoFromGetResponse(response.data)));
  }

  getHighlightedSubjectsByProviderId(providerId: string): Observable<SubjectModel[]> {
    return this.jsonApiService
      .get<SubjectsResponseJsonApi>(`${this.apiUrl}${providerId}/subjects/highlighted/?page[size]=20`)
      .pipe(map((response) => PreprintProvidersMapper.fromSubjectsGetResponse(response.data)));
  }
}
