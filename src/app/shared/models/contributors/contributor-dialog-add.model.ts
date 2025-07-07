import { AddContributorType } from '@osf/shared/enums';

import { ContributorAddModel } from './contributor-add.model';

export interface ContributorDialogAddModel {
  data: ContributorAddModel[];
  type: AddContributorType;
}
