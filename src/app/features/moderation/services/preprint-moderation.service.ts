import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, JsonApiResponseWithPaging } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { PaginatedData } from '@osf/shared/models';

import { PreprintModerationMapper } from '../mappers';
import {
  PreprintProviderModerationInfo,
  PreprintRelatedCountJsonApi,
  PreprintReviewActionModel,
  ReviewActionJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintModerationService {
  private readonly jsonApiService = inject(JsonApiService);

  getPreprintProviders(): Observable<PreprintProviderModerationInfo[]> {
    const baseUrl = `${environment.apiUrl}/preprint_providers/?filter[permissions]=view_actions,set_up_moderation`;

    return this.jsonApiService
      .get<JsonApiResponse<PreprintRelatedCountJsonApi[], null>>(baseUrl)
      .pipe(map((response) => response.data.map((x) => PreprintModerationMapper.fromPreprintRelatedCounts(x))));
  }

  getPreprintProvider(id: string): Observable<PreprintProviderModerationInfo> {
    const baseUrl = `${environment.apiUrl}/providers/preprints/${id}/?related_counts=true`;

    return this.jsonApiService
      .get<JsonApiResponse<PreprintRelatedCountJsonApi, null>>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromPreprintRelatedCounts(response.data)));
  }

  getPreprintReviews(page = 1): Observable<PaginatedData<PreprintReviewActionModel[]>> {
    const baseUrl = `${environment.apiUrl}/actions/reviews/?embed=provider&embed=target&page=${page}`;

    return this.jsonApiService
      .get<JsonApiResponseWithPaging<ReviewActionJsonApi[], null>>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromResponseWithPagination(response)));
  }
}
