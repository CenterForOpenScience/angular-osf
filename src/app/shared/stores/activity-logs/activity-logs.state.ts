import { Action, State, StateContext } from '@ngxs/store';

import { catchError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { ActivityLogsService } from '@osf/shared/services/activity-logs/activity-logs.service';

import { ClearActivityLogs, GetActivityLogs } from './activity-logs.actions';
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

    return this.activityLogsService
      .fetchLogs(action.resourceType, action.resourceId, action.page, action.pageSize)
      .pipe(
        tap((res) => {
          ctx.patchState({
            activityLogs: { data: res.data, isLoading: false, error: null, totalCount: res.totalCount },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'activityLogs', error))
      );
  }

  @Action(ClearActivityLogs)
  clearActivityLogsStore(ctx: StateContext<ActivityLogsStateModel>) {
    ctx.setState(ACTIVITY_LOGS_STATE_DEFAULT);
  }
}
