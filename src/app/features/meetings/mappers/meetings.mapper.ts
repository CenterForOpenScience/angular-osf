import { JsonApiResponseWithPaging } from '@core/models';

import {
  MeetingGetResponseJsonApi,
  MeetingSubmissionGetResponseJsonApi,
  MeetingSubmissionsWithPaging,
  MeetingsWithPaging,
} from '../models';

export class MeetingsMapper {
  static fromMeetingsGetResponse(
    response: JsonApiResponseWithPaging<MeetingGetResponseJsonApi[], null>
  ): MeetingsWithPaging {
    return {
      data: response.data.map((item) => ({
        id: item.id,
        name: item.attributes.name,
        location: item.attributes.location,
        startDate: item.attributes.start_date,
        endDate: item.attributes.end_date,
        submissionsCount: item.attributes.submissions_count,
      })),
      totalCount: response.links.meta.total,
    };
  }

  static fromMeetingSubmissionGetResponse(
    response: JsonApiResponseWithPaging<MeetingSubmissionGetResponseJsonApi[], null>
  ): MeetingSubmissionsWithPaging {
    return {
      data: response.data.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        dateCreated: item.attributes.date_created,
        authorName: item.attributes.author_name,
        downloadCount: item.attributes.download_count,
        meetingCategory: item.attributes.meeting_category,
        downloadLink: item.links.download,
      })),
      totalCount: response.links.meta.total,
    };
  }

  static fromMeetingGetResponse(response: MeetingGetResponseJsonApi) {
    return {
      id: response.id,
      name: response.attributes.name,
      location: response.attributes.location,
      startDate: response.attributes.start_date,
      endDate: response.attributes.end_date,
      submissionsCount: response.attributes.submissions_count,
    };
  }
}
