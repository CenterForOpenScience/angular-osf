import { StorageItem } from '@shared/models';

export interface FormattedCitationItem {
  item: StorageItem;
  formattedCitation: string;
  itemUrl: string;
}
