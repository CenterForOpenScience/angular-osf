import { MenuItem } from 'primeng/api';

import { WikiItemType } from '../../enums/wiki-type.enum';

export interface WikiMenuItem extends MenuItem {
  type?: WikiItemType;
  items?: WikiMenuItem[];
}
