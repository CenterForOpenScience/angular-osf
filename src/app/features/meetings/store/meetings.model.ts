import { AsyncStateWithTotalCount } from '@osf/shared/models';

import { Meeting, MeetingSubmission } from '../models';

export interface MeetingsStateModel {
  meetings: AsyncStateWithTotalCount<Meeting[]>;
  meetingSubmissions: AsyncStateWithTotalCount<MeetingSubmission[]>;
}
