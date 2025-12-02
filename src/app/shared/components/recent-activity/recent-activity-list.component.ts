import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';

@Component({
  selector: 'osf-recent-activity-list',
  imports: [TranslatePipe, DatePipe, CustomPaginatorComponent, Skeleton],
  templateUrl: './recent-activity-list.component.html',
  styleUrl: './recent-activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityListComponent {
  activityLogs = input.required<ActivityLogWithDisplay[]>();
  isLoading = input.required<boolean>();
  totalCount = input.required<number>();
  pageSize = input.required<number>();
  firstIndex = input.required<number>();

  pageChange = output<PaginatorState>();

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit(event);
  }
}
