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
    if (!state?.bibliographicContributorsList?.data) {
      return [];
    }

    return state.bibliographicContributorsList.data;
  }

  @Selector([ContributorsState])
  static isBibliographicContributorsLoading(state: ContributorsStateModel) {
    return state?.bibliographicContributorsList?.isLoading || false;
  }

  @Selector([ContributorsState])
  static getBibliographicContributorsTotalCount(state: ContributorsStateModel) {
    return state?.bibliographicContributorsList?.totalCount || 0;
  }

  @Selector([ContributorsState])
  static hasMoreBibliographicContributors(state: ContributorsStateModel) {
    return (
      state?.bibliographicContributorsList?.data?.length < state?.bibliographicContributorsList?.totalCount &&
      !state?.bibliographicContributorsList?.isLoading
    );
  }

  @Selector([ContributorsState])
  static isContributorsLoading(state: ContributorsStateModel) {
    return state?.contributorsList?.isLoading || false;
  }

  @Selector([ContributorsState])
  static isContributorsLoadingMore(state: ContributorsStateModel) {
    return state?.contributorsList?.isLoadingMore || false;
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
  static hasMoreContributors(state: ContributorsStateModel) {
    return (
      state?.contributorsList?.data?.length < state?.contributorsList?.totalCount && !state?.contributorsList?.isLoading
    );
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
