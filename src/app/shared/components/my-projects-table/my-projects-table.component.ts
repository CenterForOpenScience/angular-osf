import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from '@angular/core';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources-item.model';
import { TableParameters } from '@osf/shared/models/table-parameters.model';

import { ContributorsListShortenerComponent } from '../contributors-list-shortener/contributors-list-shortener.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'osf-my-projects-table',
  imports: [
    TableModule,
    Skeleton,
    IconComponent,
    ContributorsListShortenerComponent,
    NgTemplateOutlet,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './my-projects-table.component.html',
  styleUrl: './my-projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsTableComponent {
  private readonly BASE_COLUMN_COUNT = 3;

  readonly items = input<MyResourcesItem[]>([]);
  readonly tableParams = input.required<TableParameters>();
  readonly sortColumn = input<string | undefined>(undefined);
  readonly sortOrder = input<SortOrder>(SortOrder.Asc);
  readonly isLoading = input<boolean>(false);
  readonly emptyMessageKey = input<string>('common.search.noResultsFound');
  readonly downloadCellTemplate = input<TemplateRef<{ $implicit: MyResourcesItem }>>();

  readonly pageChange = output<TablePageEvent>();
  readonly sort = output<SortEvent>();
  readonly itemClick = output<MyResourcesItem>();

  readonly skeletonData = Array.from({ length: 10 }, () => ({}) as MyResourcesItem);

  readonly columnCount = computed(() => this.BASE_COLUMN_COUNT + Number(!!this.downloadCellTemplate()));

  onPageChange(event: TablePageEvent): void {
    this.pageChange.emit(event);
  }

  onSort(event: SortEvent): void {
    this.sort.emit(event);
  }

  onItemClick(item: MyResourcesItem): void {
    this.itemClick.emit(item);
  }
}
