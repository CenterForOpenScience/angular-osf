import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { TableParameters } from '@osf/shared/models/table-parameters.model';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { MyResourcesItem } from '@shared/models/my-resources/my-resources.models';

@Component({
  selector: 'osf-my-projects-table',
  imports: [CommonModule, TableModule, SearchInputComponent, Skeleton, TranslatePipe],
  templateUrl: './my-projects-table.component.html',
  styleUrl: './my-projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsTableComponent {
  items = input<MyResourcesItem[]>([]);
  tableParams = input.required<TableParameters>();
  searchControl = input<FormControl>(new FormControl(''));
  sortColumn = input<string | undefined>(undefined);
  sortOrder = input<SortOrder>(SortOrder.Asc);
  isLoading = input<boolean>(false);
  searchPlaceholder = input<string>('myProjects.table.searchPlaceholder');

  pageChange = output<TablePageEvent>();
  sort = output<SortEvent>();
  itemClick = output<MyResourcesItem>();

  protected onPageChange(event: TablePageEvent): void {
    this.pageChange.emit(event);
  }

  protected onSort(event: SortEvent): void {
    this.sort.emit(event);
  }

  protected onItemClick(item: MyResourcesItem): void {
    this.itemClick.emit(item);
  }
}
