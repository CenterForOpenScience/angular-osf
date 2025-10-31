import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';

import { ContributorAddModel } from './contributor-add.model';

export interface ContributorDialogAddModel {
  data: ContributorAddModel[];
  type: AddContributorType;
  childNodeIds?: string[];
}
