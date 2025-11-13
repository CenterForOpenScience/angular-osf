export interface DiscoverableFilter {
  key: string;
  label: string;
  operator: FilterOperatorOption;
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

export enum FilterOperatorOption {
  AnyOf = 'any-of',
  Date = 'trove:at-date',
  IsPresent = 'is-present',
}

export interface FilterOption {
  label: string;
  value: string;
  cardSearchResultCount: number;
}
