import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

export interface ActivityLogsStateModel {
  activityLogs: AsyncStateWithTotalCount<ActivityLogWithDisplay[]>;
}

export const ACTIVITY_LOGS_STATE_DEFAULT: ActivityLogsStateModel = {
  activityLogs: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
