export interface ComponentCheckboxItemModel {
  id: string;
  title: string;
  isCurrent?: boolean;
  disabled: boolean;
  checked: boolean;
  parentId?: string | null;
}
