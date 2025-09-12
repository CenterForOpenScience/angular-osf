import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { CustomPaginatorComponent, IconComponent } from '@osf/shared/components';

import { PreprintReviewStatus, ReviewStatusIcon } from '../../constants';
import { PreprintReviewActionModel } from '../../models';

@Component({
  selector: 'osf-preprint-recent-activity-list',
  imports: [TableModule, DatePipe, TranslatePipe, IconComponent, Skeleton, CustomPaginatorComponent],
  templateUrl: './preprint-recent-activity-list.component.html',
  styleUrl: './preprint-recent-activity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintRecentActivityListComponent {
  reviews = input.required<PreprintReviewActionModel[]>();
  isLoading = input(false);
  totalCount = input(0);

  pageChanged = output<number>();

  first = signal(0);
  readonly reviewStatusIcon = ReviewStatusIcon;
  readonly preprintReviewStatus = PreprintReviewStatus;

  onPageChange(event: PaginatorState) {
    this.pageChanged.emit(event.page ?? 1);
  }
}
