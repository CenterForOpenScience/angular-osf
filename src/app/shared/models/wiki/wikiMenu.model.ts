import { MenuItem } from 'primeng/api';

import { WikiItemType } from './wikiType.model';

export interface WikiMenuItem extends MenuItem {
  type?: WikiItemType;
  items?: WikiMenuItem[];
}
