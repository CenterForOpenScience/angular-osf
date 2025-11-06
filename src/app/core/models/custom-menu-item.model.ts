import { MenuItem } from 'primeng/api';

import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

export interface CustomMenuItem extends MenuItem {
  requiredPermission?: UserPermissions;
  items?: CustomMenuItem[];
}
