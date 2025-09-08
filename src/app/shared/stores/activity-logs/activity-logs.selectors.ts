import { Selector } from '@ngxs/store';

import { SafeHtml } from '@angular/platform-browser';

import { ActivityLog } from '@shared/models';

import { ActivityLogsStateModel } from './activity-logs.model';
import { ActivityLogsState } from './activity-logs.state';

type ActivityLogWithDisplay = ActivityLog & { formattedActivity?: SafeHtml };

export class ActivityLogsSelectors {
  @Selector([ActivityLogsState])
  static getActivityLogs(state: ActivityLogsStateModel): ActivityLog[] {
    return state.activityLogs.data;
  }

  @Selector([ActivityLogsState])
  static getFormattedActivityLogs(state: ActivityLogsStateModel): ActivityLogWithDisplay[] {
    return state.activityLogs.data as ActivityLogWithDisplay[];
  }

  @Selector([ActivityLogsState])
  static getActivityLogsTotalCount(state: ActivityLogsStateModel): number {
    return state.activityLogs.totalCount;
  }

  @Selector([ActivityLogsState])
  static getActivityLogsLoading(state: ActivityLogsStateModel): boolean {
    return state.activityLogs.isLoading;
  }
}
