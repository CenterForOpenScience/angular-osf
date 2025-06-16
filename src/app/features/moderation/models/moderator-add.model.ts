import { ModeratorPermission } from '../enums';

export interface ModeratorAddModel {
  id?: string;
  permission?: ModeratorPermission;
  fullName?: string;
  email?: string;
}
