import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PaginatedData } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { RegistrySort, SubmissionReviewStatus } from '../enums';
import { RegistryModerationMapper } from '../mappers';
import { RegistryModeration, RegistryResponseJsonApi, ReviewAction, ReviewActionsResponseJsonApi } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryModerationService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getRegistrySubmissions(
    provider: string,
    status: string,
    page = 1,
    sort = RegistrySort.RegisteredNewest
  ): Observable<PaginatedData<RegistryModeration[]>> {
    const filters =
      status === SubmissionReviewStatus.PendingUpdates
        ? `filter[reviews_state]=embargo,accepted&filter[revision_state]=pending_moderation`
        : status === SubmissionReviewStatus.Embargo
          ? `filter[reviews_state]=embargo,pending_embargo_termination`
          : status === SubmissionReviewStatus.Removed
            ? `filter[reviews_state]=withdrawn`
            : `filter[reviews_state]=${status}`;

    const baseUrl = `${this.apiUrl}/providers/registrations/${provider}/registrations/?page=${page}&page[size]=10&${filters}&sort=${sort}`;
    const params = {
      'embed[]': ['schema_responses'],
    };
    return this.jsonApiService
      .get<RegistryResponseJsonApi>(baseUrl, params)
      .pipe(map((response) => RegistryModerationMapper.fromResponseWithPagination(response)));
  }

  getRegistrySubmissionHistory(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${this.apiUrl}/registrations/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }
}
