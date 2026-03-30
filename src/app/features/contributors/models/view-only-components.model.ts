export interface ViewOnlyLinkComponentItem {
  id: string;
  title: string;
  isCurrentResource?: boolean;
  disabled: boolean;
  checked: boolean;
  parentId?: string | null;
}
