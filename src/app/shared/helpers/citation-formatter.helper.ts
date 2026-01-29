import { StorageItem } from '../models/addons/storage-item.model';

export function getItemUrl(item: StorageItem): string {
  return (item.csl?.['URL'] as string) || '';
}
