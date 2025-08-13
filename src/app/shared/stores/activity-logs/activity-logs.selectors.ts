import { Selector } from '@ngxs/store';

import { ActivityLogJsonApi } from '@shared/models';

import { ActivityLogsStateModel } from './activity-logs.model';
import { ActivityLogsState } from './activity-logs.state';

export class ActivityLogsSelectors {
  @Selector([ActivityLogsState])
  static getActivityLogs(state: ActivityLogsStateModel): ActivityLogJsonApi[] {
    return state.activityLogs.data;
  }

  @Selector([ActivityLogsState])
  static getLoading(state: ActivityLogsStateModel): boolean {
    return state.activityLogs.isLoading;
  }
}
