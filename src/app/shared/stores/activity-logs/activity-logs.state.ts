import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ActivityLogsService } from '@shared/services';

import { ClearActivityLogsStore, GetActivityLogs } from './activity-logs.actions';
import { ActivityLogsStateModel } from './activity-logs.model';

const defaultState: ActivityLogsStateModel = {
  activityLogs: {
    data: [],
    isLoading: false,
    error: null,
  },
};

@State<ActivityLogsStateModel>({
  name: 'activityLogs',
  defaults: defaultState,
})
@Injectable()
export class ActivityLogsState {
  private readonly activityLogsService = inject(ActivityLogsService);

  @Action(GetActivityLogs)
  getActivityLogs(ctx: StateContext<ActivityLogsStateModel>, action: GetActivityLogs) {
    ctx.patchState({
      activityLogs: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.activityLogsService.fetchLogs(action.projectId, action.page, action.pageSize).pipe(
      tap((data) => {
        ctx.patchState({
          activityLogs: {
            data: data,
            isLoading: false,
            error: null,
          },
        });
      })
    );
  }

  @Action(ClearActivityLogsStore)
  clearActivityLogsStore(ctx: StateContext<ActivityLogsStateModel>) {
    ctx.setState(defaultState);
  }
}
