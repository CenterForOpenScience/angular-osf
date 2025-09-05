import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomPaginatorComponent } from '@shared/components';
import { ActivityLogDisplayService } from '@shared/services';
import {
  ActivityLogsSelectors,
  ClearActivityLogsStore,
  GetRegistrationActivityLogs,
} from '@shared/stores/activity-logs';

@Component({
  selector: 'osf-registration-recent-activity',
  imports: [TranslatePipe, Skeleton, DatePipe, CustomPaginatorComponent],
  templateUrl: './registration-recent-activity.component.html',
  styleUrl: './registration-recent-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationRecentActivityComponent implements OnDestroy {
  private readonly activityLogDisplayService = inject(ActivityLogDisplayService);
  private readonly route = inject(ActivatedRoute);

  readonly pageSize = 10;

  protected currentPage = signal<number>(1);
  protected activityLogs = select(ActivityLogsSelectors.getActivityLogs);
  protected totalCount = select(ActivityLogsSelectors.getActivityLogsTotalCount);
  protected isLoading = select(ActivityLogsSelectors.getActivityLogsLoading);
  protected firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize);

  protected actions = createDispatchMap({
    getRegistrationActivityLogs: GetRegistrationActivityLogs,
    clearActivityLogsStore: ClearActivityLogsStore,
  });

  protected formattedActivityLogs = computed(() => {
    const logs = this.activityLogs();
    return logs.map((log) => ({
      ...log,
      formattedActivity: this.activityLogDisplayService.getActivityDisplay(log),
    }));
  });

  constructor() {
    const registrationId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];
    if (registrationId) {
      this.actions.getRegistrationActivityLogs(registrationId, '1', String(this.pageSize));
    }
  }

  onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      const pageNumber = event.page + 1;
      this.currentPage.set(pageNumber);
      const registrationId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];
      if (registrationId) {
        this.actions.getRegistrationActivityLogs(registrationId, String(pageNumber), String(this.pageSize));
      }
    }
  }

  ngOnDestroy(): void {
    this.actions.clearActivityLogsStore();
  }
}
