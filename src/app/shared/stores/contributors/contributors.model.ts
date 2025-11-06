import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorAddModel } from '@shared/models/contributors/contributor-add.model';
import { RequestAccessModel } from '@shared/models/request-access/request-access.model';
import { AsyncStateModel } from '@shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@shared/models/store/async-state-with-total-count.model';

export interface ContributorsList extends AsyncStateWithTotalCount<ContributorModel[]> {
  page: number;
  pageSize: number;
}

export interface ContributorsListWithFiltersModel extends ContributorsList {
  searchValue: string | null;
  permissionFilter: string | null;
  bibliographyFilter: boolean | null;
  isLoadingMore: boolean;
}

export interface ContributorsStateModel {
  contributorsList: ContributorsListWithFiltersModel;
  bibliographicContributorsList: ContributorsList;
  requestAccessList: AsyncStateModel<RequestAccessModel[]>;
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
    totalCount: 0,
    page: 1,
    pageSize: DEFAULT_TABLE_PARAMS.rows,
    isLoadingMore: false,
  },
  bibliographicContributorsList: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    totalCount: 0,
    page: 0,
    pageSize: DEFAULT_TABLE_PARAMS.rows,
  },
  requestAccessList: {
    data: [],
    isLoading: false,
    error: null,
  },
  users: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
