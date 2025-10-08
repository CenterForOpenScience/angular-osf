import { UserPermissions } from '@osf/shared/enums';

export interface NodeShortInfoModel {
  id: string;
  title: string;
  isPublic: boolean;
  permissions: UserPermissions[];
  parentId?: string;
}
