import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, JsonApiResponseWithPaging } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { PreprintProvidersMapper } from '@osf/features/preprints/mappers';
import { PreprintProviderDetailsJsonApi, PreprintProviderShortInfo } from '@osf/features/preprints/models';
import { PaginatedData } from '@osf/shared/models';

import { PreprintReviewActionMapper } from '../mappers';
import { PreprintReviewActionModel, ReviewActionJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintModerationService {
  private readonly jsonApiService = inject(JsonApiService);

  getPreprintProvidersToModerate(): Observable<PreprintProviderShortInfo[]> {
    const baseUrl = `${environment.apiUrl}/preprint_providers/?filter[permissions]=view_actions,set_up_moderation`;

    return this.jsonApiService
      .get<JsonApiResponse<PreprintProviderDetailsJsonApi[], null>>(baseUrl)
      .pipe(map((response) => PreprintProvidersMapper.toPreprintProviderShortInfoFromGetResponse(response.data)));
  }

  getPreprintReviews(page = 1): Observable<PaginatedData<PreprintReviewActionModel[]>> {
    const baseUrl = `${environment.apiUrl}/actions/reviews/?embed[]=target&page=${page}`;

    return this.jsonApiService
      .get<JsonApiResponseWithPaging<ReviewActionJsonApi[], null>>(baseUrl)
      .pipe(map((response) => PreprintReviewActionMapper.fromResponseWithPagination(response)));
  }
}
