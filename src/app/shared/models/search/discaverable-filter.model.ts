import { SelectOption } from '@shared/models';

export interface DiscoverableFilter {
  key: string;
  label: string;
  type: 'select' | 'date' | 'checkbox';
  operator: string;
  options?: SelectOption[];
  selectedValues?: SelectOption[];
  description?: string;
  helpLink?: string;
  helpLinkText?: string;
  resultCount?: number;
  isLoading?: boolean;
  isLoaded?: boolean;
  hasOptions?: boolean;
  loadOptionsOnExpand?: boolean;
}
