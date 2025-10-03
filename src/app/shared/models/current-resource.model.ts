import { UserPermissions } from '../enums';

export interface CurrentResource {
  id: string;
  type: string;
  parentId?: string;
  parentType?: string;
  rootResourceId?: string;
  wikiEnabled?: boolean;
  permissions: UserPermissions[];
}
