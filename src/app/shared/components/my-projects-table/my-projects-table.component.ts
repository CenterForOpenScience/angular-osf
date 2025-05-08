import { SortEvent } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { MyProjectsItem } from '@osf/features/my-projects/entities/my-projects.entities';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { SortOrder } from '@shared/utils/sort-order.enum';

@Component({
  selector: 'osf-my-projects-table',
  standalone: true,
  imports: [CommonModule, TableModule, SearchInputComponent, Skeleton],
  templateUrl: './my-projects-table.component.html',
  styleUrl: './my-projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsTableComponent {
  items = input<MyProjectsItem[]>([]);
  tableParams = input.required<TableParameters>();
  searchValue = input<string>('');
  sortColumn = input<string | undefined>(undefined);
  sortOrder = input<SortOrder>(SortOrder.Asc);
  isLoading = input<boolean>(false);
  searchPlaceholder = input<string>('Filter by title, description, and tags');

  searchValueChange = output<string>();
  pageChange = output<TablePageEvent>();
  sort = output<SortEvent>();
  itemClick = output<MyProjectsItem>();

  protected onSearchChange(value: string | undefined): void {
    this.searchValueChange.emit(value ?? '');
  }

  protected onPageChange(event: TablePageEvent): void {
    this.pageChange.emit(event);
  }

  protected onSort(event: SortEvent): void {
    this.sort.emit(event);
  }

  protected onItemClick(item: MyProjectsItem): void {
    this.itemClick.emit(item);
  }
}
