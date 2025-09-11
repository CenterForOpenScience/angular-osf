import { ContributorAddModel, ContributorModel } from '@osf/shared/models';
import { AsyncStateModel, AsyncStateWithTotalCount } from '@osf/shared/models/store';

export interface ContributorsStateModel {
  contributorsList: AsyncStateModel<ContributorModel[]> & {
    searchValue: string | null;
    permissionFilter: string | null;
    bibliographyFilter: boolean | null;
  };
  users: AsyncStateWithTotalCount<ContributorAddModel[]>;
}

export const CONTRIBUTORS_STATE_DEFAULTS: ContributorsStateModel = {
  contributorsList: {
    data: [],
    isLoading: false,
    error: '',
    searchValue: null,
    permissionFilter: null,
    bibliographyFilter: null,
  },
  users: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
