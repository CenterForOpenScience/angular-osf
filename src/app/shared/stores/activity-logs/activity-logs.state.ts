import { Action, State, StateContext } from '@ngxs/store';

import { catchError, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ActivityLogsService } from '@osf/shared/services/activity-logs/activity-logs.service';

import { ClearActivityLogsStore, GetActivityLogs, GetRegistrationActivityLogs } from './activity-logs.actions';
import { ACTIVITY_LOGS_STATE_DEFAULT, ActivityLogsStateModel } from './activity-logs.model';

@State<ActivityLogsStateModel>({
  name: 'activityLogs',
  defaults: ACTIVITY_LOGS_STATE_DEFAULT,
})
@Injectable()
export class ActivityLogsState {
  private readonly activityLogsService = inject(ActivityLogsService);

  @Action(GetActivityLogs)
  getActivityLogs(ctx: StateContext<ActivityLogsStateModel>, action: GetActivityLogs) {
    ctx.patchState({
      activityLogs: { data: [], isLoading: true, error: null, totalCount: 0 },
    });

    return this.activityLogsService.fetchLogs(action.projectId, action.page, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          activityLogs: { data: res.data, isLoading: false, error: null, totalCount: res.totalCount },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          activityLogs: { data: [], isLoading: false, error, totalCount: 0 },
        });
        return EMPTY;
      })
    );
  }

  @Action(GetRegistrationActivityLogs)
  getRegistrationActivityLogs(ctx: StateContext<ActivityLogsStateModel>, action: GetRegistrationActivityLogs) {
    ctx.patchState({
      activityLogs: { data: [], isLoading: true, error: null, totalCount: 0 },
    });

    return this.activityLogsService.fetchRegistrationLogs(action.registrationId, action.page, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          activityLogs: { data: res.data, isLoading: false, error: null, totalCount: res.totalCount },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          activityLogs: { data: [], isLoading: false, error, totalCount: 0 },
        });
        return EMPTY;
      })
    );
  }

  @Action(ClearActivityLogsStore)
  clearActivityLogsStore(ctx: StateContext<ActivityLogsStateModel>) {
    ctx.setState(ACTIVITY_LOGS_STATE_DEFAULT);
  }
}
