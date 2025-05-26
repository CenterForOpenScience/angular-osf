export interface NavItem {
  path: string;
  label: string;
  icon?: string;
  items?: NavItem[];
  isCollapsible?: boolean;
  useExactMatch: boolean;
}
