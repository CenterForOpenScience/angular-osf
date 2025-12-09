import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { RecentActivityListComponent } from '@osf/shared/components/recent-activity/recent-activity-list.component';
import { ACTIVITY_LOGS_DEFAULT_PAGE_SIZE } from '@osf/shared/constants/activity-logs';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsSelectors, ClearActivityLogs, GetActivityLogs } from '@osf/shared/stores/activity-logs';

@Component({
  selector: 'osf-registration-recent-activity',
  imports: [RecentActivityListComponent, TranslatePipe],
  templateUrl: './registration-recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationRecentActivityComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);

  readonly pageSize = ACTIVITY_LOGS_DEFAULT_PAGE_SIZE;

  readonly registrationId = toSignal<string | undefined>(
    this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined)
  );

  currentPage = signal<number>(1);

  activityLogs = select(ActivityLogsSelectors.getActivityLogs);
  totalCount = select(ActivityLogsSelectors.getActivityLogsTotalCount);
  isLoading = select(ActivityLogsSelectors.getActivityLogsLoading);

  firstIndex = computed(() => (this.currentPage() - 1) * this.pageSize);

  actions = createDispatchMap({ getActivityLogs: GetActivityLogs, clearActivityLogsStore: ClearActivityLogs });

  constructor() {
    effect(() => {
      const registrationId = this.registrationId();
      const page = this.currentPage();

      if (registrationId) {
        this.actions.getActivityLogs(registrationId, CurrentResourceType.Registrations, page, this.pageSize);
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
