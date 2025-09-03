import { MenuItem } from 'primeng/api';

import { WikiItemType } from './wiki-type.model';

export interface WikiMenuItem extends MenuItem {
  type?: WikiItemType;
  items?: WikiMenuItem[];
}
