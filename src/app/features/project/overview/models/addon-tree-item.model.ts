import { StorageItem } from '@osf/shared/models/addons/storage-item.model';

export interface AddonTreeItem {
  item: StorageItem;
  children: AddonTreeItem[];
  expanded: boolean;
  loading: boolean;
}
