import { ActivityLogWithDisplay } from '@shared/models/activity-logs/activity-log-with-display.model';

export interface ActivityLogsSlice<T> {
  data: T;
  isLoading: boolean;
  error: unknown | null;
  totalCount: number;
}

export interface ActivityLogsStateModel {
  activityLogs: ActivityLogsSlice<ActivityLogWithDisplay[]>;
}

export const ACTIVITY_LOGS_STATE_DEFAULT: ActivityLogsStateModel = {
  activityLogs: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
