import { Selector } from '@ngxs/store';

import { Meeting, MeetingSubmission } from '../models';

import { MeetingsStateModel } from './meetings.model';
import { MeetingsState } from './meetings.state';

export class MeetingsSelectors {
  @Selector([MeetingsState])
  static getAllMeetings(state: MeetingsStateModel): Meeting[] {
    return state.meetings.data;
  }

  @Selector([MeetingsState])
  static getMeetingById(state: MeetingsStateModel): (meetingId: string) => Meeting | undefined {
    return (meetingId: string) => state.meetings.data.find((meeting) => meeting.id === meetingId);
  }

  @Selector([MeetingsState])
  static isMeetingsLoading(state: MeetingsStateModel): boolean {
    return state.meetings.isLoading;
  }

  @Selector([MeetingsState])
  static getAllMeetingSubmissions(state: MeetingsStateModel): MeetingSubmission[] {
    return state.meetingSubmissions.data;
  }

  @Selector([MeetingsState])
  static isMeetingSubmissionsLoading(state: MeetingsStateModel): boolean {
    return state.meetingSubmissions.isLoading;
  }

  @Selector([MeetingsState])
  static getMeetingsTotalCount(state: MeetingsStateModel): number {
    return state.meetings.totalCount;
  }

  @Selector([MeetingsState])
  static getMeetingSubmissionsTotalCount(state: MeetingsStateModel): number {
    return state.meetingSubmissions.totalCount;
  }
}
