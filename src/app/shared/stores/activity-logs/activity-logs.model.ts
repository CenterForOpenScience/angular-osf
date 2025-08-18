import { ActivityLog, AsyncStateWithTotalCount } from '@shared/models';

export interface ActivityLogsStateModel {
  activityLogs: AsyncStateWithTotalCount<ActivityLog[]>;
}

export const ACTIVITY_LOGS_STATE_DEFAULT: ActivityLogsStateModel = {
  activityLogs: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
