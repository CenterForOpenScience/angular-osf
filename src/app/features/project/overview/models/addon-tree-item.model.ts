import { StorageItem } from '@shared/models';

export interface AddonTreeItem {
  item: StorageItem;
  children: AddonTreeItem[];
  expanded: boolean;
  loading: boolean;
}
