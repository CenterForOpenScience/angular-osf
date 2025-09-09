import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MultiSelect } from 'primeng/multiselect';
import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  TableCellData,
  TableCellLink,
  TableColumn,
  TableIconClickEvent,
} from '@osf/features/admin-institutions/models';
import { CustomPaginatorComponent } from '@osf/shared/components';
import { StopPropagationDirective } from '@shared/directives';
import { PaginationLinksModel, SearchFilters } from '@shared/models';

import { DOWNLOAD_OPTIONS } from '../../constants';
import { DownloadType } from '../../enums';

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
    Skeleton,
    StopPropagationDirective,
    DatePipe,
  ],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTableComponent {
  private readonly translateService = inject(TranslateService);

  tableColumns = input.required<TableColumn[]>();
  tableData = input.required<TableCellData[]>();

  isLoading = input(false);
  enablePagination = input<boolean>(false);
  totalCount = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);
  first = input<number>(0);

  sortField = input<string>('');
  sortOrder = input<number>(1);
  reportsLink = input<string | undefined>('');

  isNextPreviousPagination = input<boolean>(false);

  paginationLinks = input<PaginationLinksModel>();

  visible = true;

  pageChanged = output<PaginatorState>();
  sortChanged = output<SearchFilters>();
  iconClicked = output<TableIconClickEvent>();
  pageSwitched = output<string>();
  downloadClicked = output<DownloadType>();

  skeletonData: TableCellData[] = Array.from({ length: 10 }, () => ({}) as TableCellData);
  selectedColumns = signal<TableColumn[]>([]);

  downloadMenuItems = DOWNLOAD_OPTIONS;

  selectedColumnsComputed = computed(() => {
    const selected = this.selectedColumns();
    const allColumns = this.tableColumns();

    if (selected.length === 0) {
      return allColumns;
    }

    return selected;
  });

  firstLink = computed(() => this.paginationLinks()?.first?.href || '');
  prevLink = computed(() => this.paginationLinks()?.prev?.href || '');
  nextLink = computed(() => this.paginationLinks()?.next?.href || '');

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
        sortOrder: event.order,
      } as SearchFilters);
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

  switchPage(link: string) {
    this.pageSwitched.emit(link);
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
