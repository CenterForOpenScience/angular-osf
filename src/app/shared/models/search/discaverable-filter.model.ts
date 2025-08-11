import { SelectOption } from '@shared/models';

export interface DiscoverableFilter {
  key: string;
  label: string;
  type: 'select' | 'date' | 'checkbox' | 'group';
  operator: string;
  options?: SelectOption[];
  selectedValues?: SelectOption[];
  description?: string;
  helpLink?: string;
  helpLinkText?: string;
  resultCount?: number;
  isLoading?: boolean;
  isLoaded?: boolean;
  isPaginationLoading?: boolean;
  isSearchLoading?: boolean;
  hasOptions?: boolean;
  loadOptionsOnExpand?: boolean;
  filters?: DiscoverableFilter[];
}
