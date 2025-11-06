import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { ACTIVITY_LOGS_DEFAULT_PAGE_SIZE } from '@shared/constants/activity-logs';
import {
  ActivityLogsSelectors,
  ClearActivityLogsStore,
  GetRegistrationActivityLogs,
} from '@shared/stores/activity-logs';

@Component({
  selector: 'osf-registration-recent-activity',
  imports: [TranslatePipe, DatePipe, CustomPaginatorComponent, Skeleton],
  templateUrl: './registration-recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationRecentActivityComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly environment = inject(ENVIRONMENT);

  readonly pageSize = this.environment.activityLogs?.pageSize ?? ACTIVITY_LOGS_DEFAULT_PAGE_SIZE;

  private readonly registrationId: string = (this.route.snapshot.params['id'] ??
    this.route.parent?.snapshot.params['id']) as string;

  currentPage = signal<number>(1);

  formattedActivityLogs = select(ActivityLogsSelectors.getFormattedActivityLogs);
  totalCount = select(ActivityLogsSelectors.getActivityLogsTotalCount);
  isLoading = select(ActivityLogsSelectors.getActivityLogsLoading);

  firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize);

  actions = createDispatchMap({
    getRegistrationActivityLogs: GetRegistrationActivityLogs,
    clearActivityLogsStore: ClearActivityLogsStore,
  });

  constructor() {
    this.actions.getRegistrationActivityLogs(this.registrationId, 1, this.pageSize);
  }

  onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      const pageNumber = event.page + 1;
      this.currentPage.set(pageNumber);
      this.actions.getRegistrationActivityLogs(this.registrationId, pageNumber, this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.actions.clearActivityLogsStore();
  }
}
