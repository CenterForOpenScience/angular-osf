import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { MyProjectsItem } from '@osf/features/my-projects/entities/my-projects.entities';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { SortOrder } from '@shared/utils/sort-order.enum';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'osf-my-projects-table',
  standalone: true,
  imports: [CommonModule, TableModule, SearchInputComponent, Skeleton],
  templateUrl: './my-projects-table.component.html',
  styleUrl: './my-projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsTableComponent {
  @Input() items: MyProjectsItem[] = [];
  @Input() tableParams!: TableParameters;
  @Input() searchValue = '';
  @Input() sortColumn?: string;
  @Input() sortOrder: SortOrder = SortOrder.Asc;
  @Input() isLoading = false;
  @Input() searchPlaceholder = 'Filter by title, description, and tags';

  @Output() searchValueChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() itemClick = new EventEmitter<MyProjectsItem>();

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
