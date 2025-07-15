import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { PreprintReviewStatus, ReviewStatusIcon } from '@osf/features/moderation/constants';
import { CustomPaginatorComponent, IconComponent } from '@osf/shared/components';

import { PreprintReviewActionModel } from '../../models';

@Component({
  selector: 'osf-recent-activity-list',
  imports: [TableModule, DatePipe, TranslatePipe, IconComponent, Skeleton, CustomPaginatorComponent],
  templateUrl: './recent-activity-list.component.html',
  styleUrl: './recent-activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityListComponent {
  reviews = input.required<PreprintReviewActionModel[]>();
  isLoading = input(false);
  totalCount = input(0);

  pageChanged = output<number>();

  protected first = signal(0);
  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly preprintReviewStatus = PreprintReviewStatus;

  onPageChange(event: PaginatorState) {
    this.pageChanged.emit(event.page ?? 1);
  }
}
