import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, PaginatedData, ResponseJsonApi } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { PreprintSubmissionsSort } from '../enums';
import { PreprintModerationMapper, RegistryModerationMapper } from '../mappers';
import {
  PreprintProviderModerationInfo,
  PreprintRelatedCountJsonApi,
  PreprintReviewActionModel,
  PreprintSubmissionResponseJsonApi,
  PreprintSubmissionWithdrawalResponseJsonApi,
  PreprintWithdrawalPaginatedData,
  ReviewAction,
  ReviewActionJsonApi,
  ReviewActionsResponseJsonApi,
} from '../models';
import { PreprintSubmissionPaginatedData } from '../models/preprint-submission.model';

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
      .get<ResponseJsonApi<ReviewActionJsonApi[]>>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromResponseWithPagination(response)));
  }

  getPreprintSubmissions(
    provider: string,
    status: string,
    page = 1,
    sort = PreprintSubmissionsSort.Newest
  ): Observable<PreprintSubmissionPaginatedData> {
    const filters = `filter[reviews_state]=${status}`;

    const baseUrl = `${environment.apiUrl}/providers/preprints/${provider}/preprints/?page=${page}&meta[reviews_state_counts]=true&${filters}&sort=${sort}`;

    return this.jsonApiService
      .get<PreprintSubmissionResponseJsonApi>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromSubmissionResponse(response)));
  }

  getPreprintWithdrawalSubmissions(
    provider: string,
    status: string,
    page = 1,
    sort = PreprintSubmissionsSort.Newest
  ): Observable<PreprintWithdrawalPaginatedData> {
    const params = `?embed=target&embed=creator&filter[machine_state]=${status}&meta[requests_state_counts]=true&page=${page}&sort=${sort}`;

    const baseUrl = `${environment.apiUrl}/providers/preprints/${provider}/withdraw_requests/${params}`;

    return this.jsonApiService
      .get<PreprintSubmissionWithdrawalResponseJsonApi>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromWithdrawalSubmissionResponse(response)));
  }

  getPreprintSubmissionReviewAction(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${environment.apiUrl}/preprints/${id}/review_actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }

  getPreprintWithdrawalSubmissionReviewAction(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${environment.apiUrl}/requests/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }
}
