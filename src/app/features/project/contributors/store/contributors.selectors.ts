import { Selector } from '@ngxs/store';

import { ContributorsStateModel } from './contributors.model';
import { ContributorsState } from './contributors.state';

export class ContributorsSelectors {
  @Selector([ContributorsState])
  static getContributors(state: ContributorsStateModel) {
    return state.contributorsList.data.filter((contributor) => {
      const matchesSearch = state.contributorsList.searchValue
        ? contributor.fullName.toLowerCase().includes(state.contributorsList.searchValue.toLowerCase())
        : true;

      const matchesPermission = state.contributorsList.permissionFilter
        ? contributor.permission.includes(state.contributorsList.permissionFilter)
        : true;

      const matchesBibliography =
        state.contributorsList.bibliographyFilter !== null
          ? contributor.isBibliographic === state.contributorsList.bibliographyFilter
          : true;

      return matchesSearch && matchesPermission && matchesBibliography;
    });
  }

  @Selector([ContributorsState])
  static isContributorsLoading(state: ContributorsStateModel) {
    return state.contributorsList.isLoading || false;
  }

  @Selector([ContributorsState])
  static isContributorsError(state: ContributorsStateModel) {
    return !!state.contributorsList.error?.length;
  }

  @Selector([ContributorsState])
  static getUsers(state: ContributorsStateModel) {
    return state.users.data;
  }

  @Selector([ContributorsState])
  static getUsersTotalCount(state: ContributorsStateModel) {
    return state.users.totalCount;
  }

  @Selector([ContributorsState])
  static isUsersLoading(state: ContributorsStateModel) {
    return state.users.isLoading || false;
  }

  @Selector([ContributorsState])
  static isUsersError(state: ContributorsStateModel) {
    return !!state.users.error?.length;
  }
}
