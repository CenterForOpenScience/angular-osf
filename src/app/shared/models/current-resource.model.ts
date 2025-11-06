import { UserPermissions } from '../enums/user-permissions.enum';

export interface CurrentResource {
  id: string;
  type: string;
  parentId?: string;
  parentType?: string;
  rootResourceId?: string;
  wikiEnabled?: boolean;
  permissions: UserPermissions[];
}
