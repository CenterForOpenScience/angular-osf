import { SafeHtml } from '@angular/platform-browser';

import { ActivityLogModel } from './activity-logs.model';

export interface ActivityLogWithDisplayModel extends ActivityLogModel {
  formattedActivity?: SafeHtml;
}
