export interface DiscoverableFilter {
  key: string;
  label: string;
  type: 'select' | 'date' | 'checkbox' | 'group';
  operator: string;
  options?: FilterOption[];
  description?: string;
  helpLink?: string;
  helpLinkText?: string;
  resultCount?: number;
  isLoading?: boolean;
  isLoaded?: boolean;
  isPaginationLoading?: boolean;
  isSearchLoading?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  cardSearchResultCount: number;
}
