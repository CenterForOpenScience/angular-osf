import { StorageItem } from '@osf/shared/models/addons/storage-item.model';

export interface FormattedCitationItem {
  item: StorageItem;
  formattedCitation: string;
  itemUrl: string;
}
