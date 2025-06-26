import { Meeting, MeetingSubmission } from '@osf/features/meetings/models';
import { AsyncStateWithTotalCount } from '@shared/models/store';

export interface MeetingsStateModel {
  meetings: AsyncStateWithTotalCount<Meeting[]>;
  meetingSubmissions: AsyncStateWithTotalCount<MeetingSubmission[]>;
}
