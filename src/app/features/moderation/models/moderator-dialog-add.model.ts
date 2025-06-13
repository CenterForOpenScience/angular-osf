import { AddModeratorType } from '../enums';

import { ModeratorAddModel } from './moderator-add.model';

export interface ModeratorDialogAddModel {
  data: ModeratorAddModel[];
  type: AddModeratorType;
}
