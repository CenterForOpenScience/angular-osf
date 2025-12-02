import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';

import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy, signal } from '@angular/core';

import { RecentActivityListComponent } from '@osf/shared/components/recent-activity/recent-activity-list.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsSelectors, ClearActivityLogs, GetActivityLogs } from '@osf/shared/stores/activity-logs';

@Component({
  selector: 'osf-project-recent-activity',
  imports: [RecentActivityListComponent, TranslatePipe],
  templateUrl: './project-recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectRecentActivityComponent implements OnDestroy {
  projectId = input<string>();

  pageSize = signal(5);
  currentPage = signal<number>(1);

  activityLogs = select(ActivityLogsSelectors.getActivityLogs);
  totalCount = select(ActivityLogsSelectors.getActivityLogsTotalCount);
  isLoading = select(ActivityLogsSelectors.getActivityLogsLoading);

  actions = createDispatchMap({ getActivityLogs: GetActivityLogs, clearActivityLogsStore: ClearActivityLogs });

  firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  constructor() {
    effect(() => {
      const projectId = this.projectId();
      const page = this.currentPage();

      if (projectId) {
        this.actions.getActivityLogs(projectId, CurrentResourceType.Projects, page, this.pageSize());
      }
    });
  }

  ngOnDestroy(): void {
    this.actions.clearActivityLogsStore();
  }

  onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      const pageNumber = event.page + 1;
      this.currentPage.set(pageNumber);
    }
  }
}
