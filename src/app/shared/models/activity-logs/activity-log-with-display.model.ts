import { SafeHtml } from '@angular/platform-browser';

import { ActivityLog } from './activity-logs.model';

export interface ActivityLogWithDisplay extends ActivityLog {
  formattedActivity?: SafeHtml;
}
