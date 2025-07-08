import { ContributorAddModel, ContributorModel } from '@osf/shared/models';
import { AsyncStateModel } from '@osf/shared/models/store';

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
