import { NumberOrNull, StringOrNull } from '@osf/shared/helpers/types.helper';

export interface MeetingGetResponseJsonApi {
  id: string;
  type: 'meetings';
  attributes: {
    name: string;
    location: string;
    start_date: Date;
    end_date: Date;
    submissions_count: number;
  };
}

export interface MeetingSubmissionGetResponseJsonApi {
  id: string;
  type: 'meeting-submissions';
  attributes: {
    title: string;
    date_created: Date;
    author_name: string;
    download_count: NumberOrNull;
    meeting_category: string;
  };
  links: {
    download: StringOrNull;
  };
}
