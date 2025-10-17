import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiResponse, PaginatedData, ResponseJsonApi } from '@osf/shared/models';
import { ContributorsService, JsonApiService } from '@osf/shared/services';

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

@Injectable({
  providedIn: 'root',
})
export class PreprintModerationService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly contributorsService = inject(ContributorsService);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getPreprintProviders(): Observable<PreprintProviderModerationInfo[]> {
    const baseUrl = `${this.apiUrl}/providers/preprints/?filter[permissions]=view_actions,set_up_moderation`;

    return this.jsonApiService
      .get<JsonApiResponse<PreprintRelatedCountJsonApi[], null>>(baseUrl)
      .pipe(map((response) => response.data.map((x) => PreprintModerationMapper.fromPreprintRelatedCounts(x))));
  }

  getPreprintProvider(id: string): Observable<PreprintProviderModerationInfo> {
    const baseUrl = `${this.apiUrl}/providers/preprints/${id}/?related_counts=true`;

    return this.jsonApiService
      .get<JsonApiResponse<PreprintRelatedCountJsonApi, null>>(baseUrl)
      .pipe(map((response) => PreprintModerationMapper.fromPreprintRelatedCounts(response.data)));
  }

  getPreprintReviews(page = 1): Observable<PaginatedData<PreprintReviewActionModel[]>> {
    const baseUrl = `${this.apiUrl}/actions/reviews/?embed=provider&embed=target&page=${page}`;

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
    const params = {
      page: page.toString(),
      'meta[reviews_state_counts]': 'true',
      'filter[reviews_state]': status,
      sort,
    };

    const baseUrl = `${this.apiUrl}/providers/preprints/${provider}/preprints/`;

    return this.jsonApiService.get<PreprintSubmissionResponseJsonApi>(baseUrl, params).pipe(
      map((response) => PreprintModerationMapper.fromSubmissionResponse(response)),
      switchMap((res) => {
        if (!res.data.length) {
          return of(res);
        }

        const actionsRequests = res.data.map((item) =>
          this.getPreprintSubmissionReviewAction(item.id).pipe(catchError(() => of([])))
        );

        return forkJoin(actionsRequests).pipe(
          map((actions) => ({ ...res, data: res.data.map((item, i) => ({ ...item, actions: actions[i] })) }))
        );
      })
    );
  }

  getPreprintWithdrawalSubmissions(
    provider: string,
    status: string,
    page = 1,
    sort = PreprintSubmissionsSort.Newest
  ): Observable<PreprintWithdrawalPaginatedData> {
    const params = {
      embed: 'target',
      'meta[requests_state_counts]': 'true',
      'filter[machine_state]': status,
      page,
      sort,
    };

    const baseUrl = `${this.apiUrl}/providers/preprints/${provider}/withdraw_requests/`;

    return this.jsonApiService.get<PreprintSubmissionWithdrawalResponseJsonApi>(baseUrl, params).pipe(
      map((response) => PreprintModerationMapper.fromWithdrawalSubmissionResponse(response)),
      switchMap((res) => {
        if (!res.data.length) {
          return of(res);
        }

        const actionsRequests = res.data.map((item) =>
          this.getPreprintWithdrawalSubmissionReviewAction(item.id).pipe(catchError(() => of([])))
        );

        return forkJoin(actionsRequests).pipe(
          map((actions) => ({ ...res, data: res.data.map((item, i) => ({ ...item, actions: actions[i] })) }))
        );
      })
    );
  }

  getPreprintSubmissionReviewAction(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${this.apiUrl}/preprints/${id}/review_actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }

  getPreprintWithdrawalSubmissionReviewAction(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${this.apiUrl}/requests/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }
}
