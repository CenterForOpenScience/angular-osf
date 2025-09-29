import { MenuItem } from 'primeng/api';

import { UserPermissions } from '@osf/shared/enums';

export interface CustomMenuItem extends MenuItem {
  requiredPermission?: UserPermissions;
  items?: CustomMenuItem[];
}
