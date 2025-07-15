import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MultiSelect } from 'primeng/multiselect';
import { PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

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
  imports: [
    MultiSelect,
    TableModule,
    FormsModule,
    ButtonDirective,
    CustomPaginatorComponent,
    Tooltip,
    TranslatePipe,
    Button,
    Menu,
  ],
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
  sortOrder = input<number>(1);

  pageChanged = output<PaginatorState>();
  sortChanged = output<QueryParams>();
  iconClicked = output<TableIconClickEvent>();

  downloadLink = input<string>('');
  reportsLink = input<string>('');

  selectedColumns = signal<TableColumn[]>([]);

  downloadMenuItems = computed(() => {
    const baseUrl = this.downloadLink();
    if (!baseUrl) return [];

    return [
      {
        label: 'CSV',
        icon: 'fa fa-file-csv',
        link: this.createUrl(baseUrl, 'csv'),
      },
      {
        label: 'TSV',
        icon: 'fa fa-file-alt',
        link: this.createUrl(baseUrl, 'tsv'),
      },
      {
        label: 'JSON',
        icon: 'fa fa-file-code',
        link: this.createUrl(baseUrl, 'json'),
      },
    ];
  });

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

  getCellValueWithFormatting(value: string | number | TableCellLink | undefined, column: TableColumn): string {
    if (this.isLink(value)) {
      return this.translateService.instant(value.text);
    }

    const stringValue = String(value);

    if (column.dateFormat && stringValue) {
      return this.formatDate(stringValue, column.dateFormat);
    }

    return this.translateService.instant(stringValue) || '';
  }

  private formatDate(value: string, format: string): string {
    if (format === 'yyyy-mm-to-mm/yyyy') {
      const yearMonthRegex = /^(\d{4})-(\d{2})$/;
      const match = value.match(yearMonthRegex);

      if (match) {
        const [, year, month] = match;
        return `${month}/${year}`;
      }
    }

    return value;
  }

  private createUrl(baseUrl: string, format: string): string {
    return `${baseUrl}?format=${format}`;
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
