import { StorageItemType } from '@osf/shared/enums/storage-item-type.enum';
import { StorageItem } from '@shared/models/addons/storage-item.model';

export const MOCK_DOCUMENT_STORAGE_ITEM: StorageItem = {
  itemId: 'doc1',
  itemName: 'Test Document',
  itemType: StorageItemType.Document,
  csl: {
    title: 'Test Document',
    author: [{ family: 'Test', given: 'Author' }],
    type: 'article',
    URL: 'https://example.com/doc1',
  },
};

export const MOCK_COLLECTION_STORAGE_ITEM: StorageItem = {
  itemId: 'col1',
  itemName: 'Test Collection',
  itemType: StorageItemType.Collection,
};

export const MOCK_FOLDER_STORAGE_ITEM: StorageItem = {
  itemId: 'folder1',
  itemName: 'Test Folder',
  itemType: StorageItemType.Folder,
};

export const MOCK_DOCUMENT_WITHOUT_CSL: StorageItem = {
  itemId: 'doc2',
  itemName: 'Document Without CSL',
  itemType: StorageItemType.Document,
};

export const MOCK_STORAGE_ITEMS: StorageItem[] = [
  MOCK_DOCUMENT_STORAGE_ITEM,
  MOCK_COLLECTION_STORAGE_ITEM,
  MOCK_FOLDER_STORAGE_ITEM,
  MOCK_DOCUMENT_WITHOUT_CSL,
];
