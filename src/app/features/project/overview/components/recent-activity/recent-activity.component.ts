import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomPaginatorComponent } from '@osf/shared/components';
import { ActivityLogDisplayService } from '@osf/shared/services';
import { ActivityLogsSelectors, GetActivityLogs } from '@osf/shared/stores/activity-logs';

@Component({
  selector: 'osf-recent-activity-list',
  imports: [TranslatePipe, Skeleton, DatePipe, CustomPaginatorComponent],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityComponent {
  private readonly activityLogDisplayService = inject(ActivityLogDisplayService);
  private readonly route = inject(ActivatedRoute);

  readonly pageSize = input.required<number>();
  currentPage = signal<number>(1);

  activityLogs = select(ActivityLogsSelectors.getActivityLogs);
  totalCount = select(ActivityLogsSelectors.getActivityLogsTotalCount);
  isLoading = select(ActivityLogsSelectors.getActivityLogsLoading);

  firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  actions = createDispatchMap({ getActivityLogs: GetActivityLogs });

  formattedActivityLogs = computed(() => {
    const logs = this.activityLogs();
    return logs.map((log) => ({
      ...log,
      formattedActivity: this.activityLogDisplayService.getActivityDisplay(log),
    }));
  });

  onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      const pageNumber = event.page + 1;
      this.currentPage.set(pageNumber);

      const projectId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];
      if (projectId) {
        this.actions.getActivityLogs(projectId, pageNumber, this.pageSize());
      }
    }
  }
}
