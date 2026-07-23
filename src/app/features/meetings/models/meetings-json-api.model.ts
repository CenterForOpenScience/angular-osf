import { NumberOrNull, StringOrNull } from '@osf/shared/helpers/types.helper';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type MeetingsListResponseJsonApi = ListResponse<MeetingDataJsonApi>;
export type MeetingSubmissionsListResponseJsonApi = ListResponse<MeetingSubmissionDataJsonApi>;
export type MeetingResponseJsonApi = ItemResponse<MeetingDataJsonApi>;

export type MeetingDataJsonApi = JsonApiResource<'meetings', MeetingAttributesJsonApi>;

export interface MeetingSubmissionDataJsonApi extends JsonApiResource<
  'meeting-submissions',
  MeetingSubmissionAttributesJsonApi
> {
  links: MeetingSubmissionLinksJsonApi;
}

interface MeetingAttributesJsonApi {
  end_date: Date;
  location: string;
  name: string;
  start_date: Date;
  submissions_count: number;
}

interface MeetingSubmissionAttributesJsonApi {
  author_name: string;
  date_created: Date;
  download_count: NumberOrNull;
  meeting_category: string;
  title: string;
}

interface MeetingSubmissionLinksJsonApi {
  download: StringOrNull;
}
