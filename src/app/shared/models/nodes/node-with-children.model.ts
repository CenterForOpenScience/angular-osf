import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

export interface NodeShortInfoModel {
  id: string;
  title: string;
  isPublic: boolean;
  permissions: UserPermissions[];
  parentId?: string;
}
