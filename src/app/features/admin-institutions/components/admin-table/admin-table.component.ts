import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  TableCellData,
  TableCellLink,
  TableColumn,
  TableIconClickEvent,
} from '@osf/features/admin-institutions/models';
import { CustomPaginatorComponent } from '@osf/shared/components';
import { SortOrder } from '@shared/enums';
import { QueryParams } from '@shared/models';

@Component({
  selector: 'osf-admin-table',
  imports: [MultiSelect, TableModule, FormsModule, ButtonDirective, CustomPaginatorComponent, TranslatePipe, Button],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTableComponent {
  private readonly translateService = inject(TranslateService);

  tableColumns = input.required<TableColumn[]>();
  tableData = input.required<TableCellData[]>();

  enablePagination = input<boolean>(false);
  totalCount = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);
  first = input<number>(0);

  sortField = input<string>('');
  sortOrder = input<number>(1); // 1 for asc, -1 for desc

  pageChanged = output<PaginatorState>();
  sortChanged = output<QueryParams>();
  iconClicked = output<TableIconClickEvent>();

  downloadLink = input<string>('');
  reportsLink = input<string>('');

  downloadLabel = input<string>('Download');
  reportsLabel = input<string>('Previous Reports');
  customizeLabel = input<string>('Customize');

  selectedColumns = signal<TableColumn[]>([]);

  selectedColumnsComputed = computed(() => {
    const selected = this.selectedColumns();
    const allColumns = this.tableColumns();

    if (selected.length === 0) {
      return allColumns;
    }

    return selected;
  });

  sortColumn = computed(() => this.sortField());
  currentSortOrder = computed(() => this.sortOrder());

  constructor() {
    effect(() => {
      const columns = this.tableColumns();
      if (columns.length > 0 && this.selectedColumns().length === 0) {
        this.selectedColumns.set(columns);
      }
    });
  }

  onColumnSelectionChange(selectedCols: TableColumn[]): void {
    this.selectedColumns.set(selectedCols);
  }

  onPageChange(event: PaginatorState): void {
    this.pageChanged.emit(event);
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      this.sortChanged.emit({
        sortColumn: event.field,
        sortOrder: event.order === -1 ? SortOrder.Desc : SortOrder.Asc,
      } as QueryParams);
    }
  }

  onIconClick(rowData: TableCellData, column: TableColumn): void {
    if (column.iconAction) {
      this.iconClicked.emit({
        rowData,
        column,
        action: column.iconAction,
      });
    }
  }

  isLink(value: string | number | TableCellLink | undefined): value is TableCellLink {
    return value !== null && value !== undefined && typeof value === 'object' && 'text' in value && 'url' in value;
  }

  getCellValue(value: string | number | TableCellLink | undefined): string {
    if (this.isLink(value)) {
      return this.translateService.instant(value.text);
    }
    return this.translateService.instant(String(value)) || '';
  }

  getLinkUrl(value: string | number | TableCellLink | undefined): string {
    if (this.isLink(value)) {
      return value.url;
    }
    return '';
  }

  getLinkTarget(value: string | number | TableCellLink | undefined, column: TableColumn): string {
    if (this.isLink(value)) {
      return value.target || column.linkTarget || '_self';
    }
    return column.linkTarget || '_self';
  }
}
