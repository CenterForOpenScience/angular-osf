export interface StorageItem {
  itemId?: string;
  itemName?: string;
  itemType?: string;
  itemLink?: string;
  canBeRoot?: boolean;
  mayContainRootCandidates?: boolean;
  csl?: Record<string, unknown>;
}
