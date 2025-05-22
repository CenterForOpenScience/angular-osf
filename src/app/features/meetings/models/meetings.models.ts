// domain models
import { NumberOrNull, StringOrNull } from '@core/helpers/types.helper';

export interface Meeting {
  id: string;
  name: string;
  submissionsCount: number;
  location: string;
  startDate: Date;
  endDate: Date;
}

export interface MeetingsWithPaging {
  data: Meeting[];
  totalCount: number;
}

export interface MeetingSubmission {
  id: string;
  title: string;
  dateCreated: Date;
  authorName: string;
  downloadCount: NumberOrNull;
  meetingCategory: string;
  downloadLink: StringOrNull;
}

export interface MeetingSubmissionsWithPaging {
  data: MeetingSubmission[];
  totalCount: number;
}

//api models
export interface MeetingGetResponse {
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

export interface MeetingSubmissionGetResponse {
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
