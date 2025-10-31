import { Selector } from '@ngxs/store';

import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';
import { ActivityLog } from '@osf/shared/models/activity-logs/activity-logs.model';

import { ActivityLogsStateModel } from './activity-logs.model';
import { ActivityLogsState } from './activity-logs.state';

export class ActivityLogsSelectors {
  @Selector([ActivityLogsState])
  static getActivityLogs(state: ActivityLogsStateModel): ActivityLog[] {
    return state.activityLogs.data;
  }

  @Selector([ActivityLogsState])
  static getFormattedActivityLogs(state: ActivityLogsStateModel): ActivityLogWithDisplay[] {
    return state.activityLogs.data;
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
