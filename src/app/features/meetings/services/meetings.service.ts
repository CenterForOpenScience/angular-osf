import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { JsonApiResponse, JsonApiResponseWithPaging } from '@osf/core/models';
import { MeetingsMapper } from '@osf/features/meetings/mappers';
import {
  MeetingGetResponse,
  MeetingSubmissionGetResponse,
  MeetingSubmissionsWithPaging,
  MeetingsWithPaging,
} from '@osf/features/meetings/models';
import { searchPreferencesToJsonApiQueryParams } from '@osf/shared/utils';
import { SearchFilters } from '@shared/models/filters';

import { meetingSortFieldMap, meetingSubmissionSortFieldMap } from '../constants';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly baseUrl = `${environment.apiDomainUrl}/_/meetings/`;

  getAllMeetings(pageNumber: number, pageSize: number, filters: SearchFilters): Observable<MeetingsWithPaging> {
    const params: Record<string, unknown> = searchPreferencesToJsonApiQueryParams(
      {},
      pageNumber,
      pageSize,
      filters,
      meetingSortFieldMap
    );

    return this.jsonApiService
      .get<JsonApiResponseWithPaging<MeetingGetResponse[], null>>(this.baseUrl, params)
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
      .get<
        JsonApiResponseWithPaging<MeetingSubmissionGetResponse[], null>
      >(`${this.baseUrl}${meetingId}/submissions/`, params)
      .pipe(map((response) => MeetingsMapper.fromMeetingSubmissionGetResponse(response)));
  }

  getMeetingById(meetingId: string) {
    return this.jsonApiService
      .get<JsonApiResponse<MeetingGetResponse, null>>(this.baseUrl + meetingId)
      .pipe(map((response) => MeetingsMapper.fromMeetingGetResponse(response.data)));
  }
}
