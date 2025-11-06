import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { Meeting, MeetingSubmission } from '../models';

export interface MeetingsStateModel {
  meetings: AsyncStateWithTotalCount<Meeting[]>;
  meetingSubmissions: AsyncStateWithTotalCount<MeetingSubmission[]>;
}
