import { Selector } from '@ngxs/store';

import { ContributorsStateModel } from './contributors.model';
import { ContributorsState } from './contributors.state';

export class ContributorsSelectors {
  @Selector([ContributorsState])
  static getContributors(state: ContributorsStateModel) {
    if (!state?.contributorsList?.data) {
      return [];
    }

    return state.contributorsList.data.filter((contributor) => {
      const matchesSearch = state.contributorsList.searchValue
        ? contributor.fullName?.toLowerCase().includes(state.contributorsList.searchValue.toLowerCase())
        : true;

      const matchesPermission = state.contributorsList.permissionFilter
        ? contributor.permission?.includes(state.contributorsList.permissionFilter)
        : true;

      const matchesBibliography =
        state.contributorsList.bibliographyFilter !== null
          ? contributor.isBibliographic === state.contributorsList.bibliographyFilter
          : true;

      return matchesSearch && matchesPermission && matchesBibliography;
    });
  }

  @Selector([ContributorsState])
  static getBibliographicContributors(state: ContributorsStateModel) {
    if (!state?.contributorsList?.data) {
      return [];
    }

    return state.contributorsList.data.filter((contributor) => contributor.isBibliographic);
  }

  @Selector([ContributorsState])
  static isContributorsLoading(state: ContributorsStateModel) {
    return state?.contributorsList?.isLoading || false;
  }

  @Selector([ContributorsState])
  static getContributorsPageNumber(state: ContributorsStateModel) {
    return state.contributorsList.page;
  }

  @Selector([ContributorsState])
  static getContributorsPageSize(state: ContributorsStateModel) {
    return state.contributorsList.pageSize;
  }

  @Selector([ContributorsState])
  static getContributorsTotalCount(state: ContributorsStateModel) {
    return state.contributorsList.totalCount;
  }

  @Selector([ContributorsState])
  static getUsers(state: ContributorsStateModel) {
    return state?.users?.data || [];
  }

  @Selector([ContributorsState])
  static getUsersTotalCount(state: ContributorsStateModel) {
    return state?.users?.totalCount || 0;
  }

  @Selector([ContributorsState])
  static isUsersLoading(state: ContributorsStateModel) {
    return state?.users?.isLoading || false;
  }

  @Selector([ContributorsState])
  static getRequestAccessList(state: ContributorsStateModel) {
    if (!state?.requestAccessList?.data) {
      return [];
    }

    return state.requestAccessList.data;
  }

  @Selector([ContributorsState])
  static areRequestAccessListLoading(state: ContributorsStateModel) {
    return state.requestAccessList.isLoading;
  }
}
