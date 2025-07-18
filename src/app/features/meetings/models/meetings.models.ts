import { NumberOrNull, StringOrNull } from '@core/helpers';

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
