import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { PaginatedData } from '@osf/shared/models';

import { RegistrySort, SubmissionReviewStatus } from '../enums';
import { RegistryModerationMapper } from '../mappers';
import { RegistryModeration, RegistryResponseJsonApi, ReviewAction, ReviewActionsResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryModerationService {
  private readonly jsonApiService = inject(JsonApiService);

  getRegistrySubmissions(
    provider: string,
    status: string,
    page = 1,
    sort = RegistrySort.RegisteredNewest
  ): Observable<PaginatedData<RegistryModeration[]>> {
    const filters =
      status === SubmissionReviewStatus.PendingUpdates
        ? `filter[reviews_state]=embargo,accepted&filter[revision_state]=pending_moderation`
        : `filter[reviews_state]=${status}`;

    const baseUrl = `${environment.apiUrl}/providers/registrations/${provider}/registrations/?page=${page}&page[size]=10&${filters}&sort=${sort}`;

    return this.jsonApiService
      .get<RegistryResponseJsonApi>(baseUrl)
      .pipe(map((response) => RegistryModerationMapper.fromResponseWithPagination(response)));
  }

  getRegistrySubmissionHistory(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${environment.apiUrl}/registrations/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }
}
