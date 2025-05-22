import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MeetingsService } from '@osf/features/meetings/services';
import { GetAllMeetings, GetMeetingById, GetMeetingSubmissions } from '@osf/features/meetings/store/meetings.actions';
import { MeetingsStateModel } from '@osf/features/meetings/store/meetings.model';

@State<MeetingsStateModel>({
  name: 'meetings',
  defaults: {
    meetings: {
      data: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    },
    meetingSubmissions: {
      data: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    },
  },
})
@Injectable()
export class MeetingsState {
  #meetingsService = inject(MeetingsService);

  @Action(GetAllMeetings)
  getAllMeetings(ctx: StateContext<MeetingsStateModel>, action: GetAllMeetings) {
    ctx.setState(patch({ meetings: patch({ isLoading: true }) }));

    return this.#meetingsService.getAllMeetings(action.pageNumber, action.pageSize, action.filters).pipe(
      tap((meetingsWithPaging) => {
        ctx.setState(
          patch({
            meetings: patch({
              data: meetingsWithPaging.data,
              isLoading: false,
              totalCount: meetingsWithPaging.totalCount,
            }),
          })
        );
      })
    );
  }

  @Action(GetMeetingById)
  getMeetingById(ctx: StateContext<MeetingsStateModel>, action: GetMeetingById) {
    ctx.setState(patch({ meetings: patch({ isLoading: true }) }));
    ctx.setState(patch({ meetingSubmissions: patch({ isLoading: true }) }));

    return this.#meetingsService.getMeetingById(action.meetingId).pipe(
      tap((meeting) => {
        ctx.setState(
          patch({
            meetings: patch({
              data: insertItem(meeting, 0),
            }),
          })
        );
      })
    );
  }

  @Action(GetMeetingSubmissions)
  getMeetingSubmissions(ctx: StateContext<MeetingsStateModel>, action: GetMeetingSubmissions) {
    ctx.setState(patch({ meetingSubmissions: patch({ isLoading: true }) }));

    return this.#meetingsService
      .getMeetingSubmissions(action.meetingId, action.pageNumber, action.pageSize, action.filters)
      .pipe(
        tap((meetingSubmissionsWithPaging) => {
          ctx.setState(
            patch({
              meetingSubmissions: patch({
                data: meetingSubmissionsWithPaging.data,
                isLoading: false,
                totalCount: meetingSubmissionsWithPaging.totalCount,
              }),
            })
          );
        })
      );
  }
}
