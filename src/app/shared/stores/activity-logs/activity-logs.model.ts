import { ActivityLogWithDisplay, AsyncStateWithTotalCount } from '@osf/shared/models';

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
