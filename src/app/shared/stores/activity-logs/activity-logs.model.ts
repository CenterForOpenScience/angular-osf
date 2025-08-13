import { ActivityLogJsonApi, AsyncStateModel } from '@shared/models';

export interface ActivityLogsStateModel {
  activityLogs: AsyncStateModel<ActivityLogJsonApi[]>;
}
