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
import { searchPreferencesToJsonApiQueryParams } from '@shared/helpers/search-pref-to-json-api-query-params.helper';
import { SearchFilters } from '@shared/models/filters/search-filters.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/_/meetings/';
  #meetingSubmissionSortFieldMap: Record<string, string> = {
    title: 'title',
    authorName: 'author_name',
    meetingCategory: 'meeting_category',
    dateCreated: 'date_created',
    downloadCount: 'download_count',
  };
  #meetingSortFieldMap: Record<string, string> = {
    name: 'name',
    submissionsCount: 'submissions_count',
    location: 'location',
    startDate: 'start_date',
  };

  getAllMeetings(pageNumber: number, pageSize: number, filters: SearchFilters): Observable<MeetingsWithPaging> {
    const params: Record<string, unknown> = {};
    searchPreferencesToJsonApiQueryParams(params, pageNumber, pageSize, filters, this.#meetingSortFieldMap);

    return this.jsonApiService.get<JsonApiResponseWithPaging<MeetingGetResponse[], null>>(this.baseUrl, params).pipe(
      map((response) => {
        return MeetingsMapper.fromMeetingsGetResponse(response);
      })
    );
  }

  getMeetingSubmissions(
    meetingId: string,
    pageNumber: number,
    pageSize: number,
    filters: SearchFilters
  ): Observable<MeetingSubmissionsWithPaging> {
    const params: Record<string, unknown> = {};
    searchPreferencesToJsonApiQueryParams(params, pageNumber, pageSize, filters, this.#meetingSubmissionSortFieldMap);

    return this.jsonApiService
      .get<
        JsonApiResponseWithPaging<MeetingSubmissionGetResponse[], null>
      >(`${this.baseUrl}${meetingId}/submissions/`, params)
      .pipe(
        map((response) => {
          return MeetingsMapper.fromMeetingSubmissionGetResponse(response);
        })
      );
  }

  getMeetingById(meetingId: string) {
    return this.jsonApiService.get<JsonApiResponse<MeetingGetResponse, null>>(this.baseUrl + meetingId).pipe(
      map((response) => {
        return MeetingsMapper.fromMeetingGetResponse(response.data);
      })
    );
  }
}
