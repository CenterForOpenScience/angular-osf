import { Meeting, MeetingSubmission } from '@osf/features/meetings/models';
import { AsyncStateWithTotalCount } from '@shared/models/store/async-state-with-total-count.model';

export interface MeetingsStateModel {
  meetings: AsyncStateWithTotalCount<Meeting[]>;
  meetingSubmissions: AsyncStateWithTotalCount<MeetingSubmission[]>;
}
