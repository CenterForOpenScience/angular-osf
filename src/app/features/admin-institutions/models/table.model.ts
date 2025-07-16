export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  isLink?: boolean;
  linkTarget?: '_blank' | '_self';
  showIcon?: boolean;
  iconClass?: string;
  iconTooltip?: string;
  iconAction?: string;
  dateFormat?: 'MM/yyyy' | 'dd/MM/yyyy' | 'shortDate' | 'mediumDate' | 'longDate' | 'fullDate' | string;
}

export interface TableCellLink {
  text: string;
  url: string;
  target?: '_blank' | '_self';
}

export type TableCellData = Record<string, string | number | TableCellLink | undefined>;

export interface TableIconClickEvent {
  rowData: TableCellData;
  column: TableColumn;
  action: string;
}
