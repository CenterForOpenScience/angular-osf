import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { searchPreferencesToJsonApiQueryParams } from '@osf/shared/helpers';
import { JsonApiResponse, ResponseJsonApi, SearchFilters } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { meetingSortFieldMap, meetingSubmissionSortFieldMap } from '../constants';
import { MeetingsMapper } from '../mappers';
import {
  MeetingGetResponseJsonApi,
  MeetingSubmissionGetResponseJsonApi,
  MeetingSubmissionsWithPaging,
  MeetingsWithPaging,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly baseUrl = `${this.environment.apiDomainUrl}/_/meetings/`;

  getAllMeetings(pageNumber: number, pageSize: number, filters: SearchFilters): Observable<MeetingsWithPaging> {
    const params: Record<string, unknown> = searchPreferencesToJsonApiQueryParams(
      {},
      pageNumber,
      pageSize,
      filters,
      meetingSortFieldMap
    );

    return this.jsonApiService
      .get<ResponseJsonApi<MeetingGetResponseJsonApi[]>>(this.baseUrl, params)
      .pipe(map((response) => MeetingsMapper.fromMeetingsGetResponse(response)));
  }

  getMeetingSubmissions(
    meetingId: string,
    pageNumber: number,
    pageSize: number,
    filters: SearchFilters
  ): Observable<MeetingSubmissionsWithPaging> {
    const params: Record<string, unknown> = searchPreferencesToJsonApiQueryParams(
      {},
      pageNumber,
      pageSize,
      filters,
      meetingSubmissionSortFieldMap
    );

    return this.jsonApiService
      .get<ResponseJsonApi<MeetingSubmissionGetResponseJsonApi[]>>(`${this.baseUrl}${meetingId}/submissions/`, params)
      .pipe(map((response) => MeetingsMapper.fromMeetingSubmissionGetResponse(response)));
  }

  getMeetingById(meetingId: string) {
    return this.jsonApiService
      .get<JsonApiResponse<MeetingGetResponseJsonApi, null>>(this.baseUrl + meetingId)
      .pipe(map((response) => MeetingsMapper.fromMeetingGetResponse(response.data)));
  }
}
