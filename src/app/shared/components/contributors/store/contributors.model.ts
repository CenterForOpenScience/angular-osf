import { AsyncStateModel } from '@osf/shared/models/store';

import { ContributorAddModel, ContributorModel } from '../models';

export interface ContributorsStateModel {
  contributorsList: AsyncStateModel<ContributorModel[]> & {
    searchValue: string | null;
    permissionFilter: string | null;
    bibliographyFilter: boolean | null;
  };
  users: AsyncStateModel<ContributorAddModel[]> & {
    totalCount: number;
  };
}
