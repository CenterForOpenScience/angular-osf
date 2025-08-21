import { Selector } from '@ngxs/store';

import { Institution, PaginationLinksModel } from '@shared/models';

import {
  InstitutionDepartment,
  InstitutionPreprint,
  InstitutionProject,
  InstitutionRegistration,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionUser,
} from '../models';

import { InstitutionsAdminModel } from './institutions-admin.model';
import { InstitutionsAdminState } from './institutions-admin.state';

export class InstitutionsAdminSelectors {
  @Selector([InstitutionsAdminState])
  static getDepartments(state: InstitutionsAdminModel): InstitutionDepartment[] {
    return state.departments.data;
  }

  @Selector([InstitutionsAdminState])
  static getDepartmentsLoading(state: InstitutionsAdminModel): boolean {
    return state.departments.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getSummaryMetrics(state: InstitutionsAdminModel): InstitutionSummaryMetrics {
    return state.summaryMetrics.data;
  }

  @Selector([InstitutionsAdminState])
  static getSummaryMetricsLoading(state: InstitutionsAdminModel): boolean {
    return state.summaryMetrics.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getHasOsfAddonSearch(state: InstitutionsAdminModel): InstitutionSearchFilter[] {
    return state.hasOsfAddonSearch.data;
  }

  @Selector([InstitutionsAdminState])
  static getHasOsfAddonSearchLoading(state: InstitutionsAdminModel): boolean {
    return state.hasOsfAddonSearch.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getStorageRegionSearch(state: InstitutionsAdminModel): InstitutionSearchFilter[] {
    return state.storageRegionSearch.data;
  }

  @Selector([InstitutionsAdminState])
  static getStorageRegionSearchLoading(state: InstitutionsAdminModel): boolean {
    return state.storageRegionSearch.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getSearchResults(state: InstitutionsAdminModel): InstitutionSearchFilter[] {
    return state.searchResults.data;
  }

  @Selector([InstitutionsAdminState])
  static getSearchResultsLoading(state: InstitutionsAdminModel): boolean {
    return state.searchResults.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getUsers(state: InstitutionsAdminModel): InstitutionUser[] {
    return state.users.data;
  }

  @Selector([InstitutionsAdminState])
  static getUsersLoading(state: InstitutionsAdminModel): boolean {
    return state.users.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getUsersTotalCount(state: InstitutionsAdminModel): number {
    return state.users.totalCount;
  }

  @Selector([InstitutionsAdminState])
  static getProjects(state: InstitutionsAdminModel): InstitutionProject[] {
    return state.projects.data;
  }

  @Selector([InstitutionsAdminState])
  static getProjectsLoading(state: InstitutionsAdminModel): boolean {
    return state.projects.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getProjectsTotalCount(state: InstitutionsAdminModel): number {
    return state.projects.totalCount;
  }

  @Selector([InstitutionsAdminState])
  static getProjectsLinks(state: InstitutionsAdminModel): PaginationLinksModel | undefined {
    return state.projects.links;
  }

  @Selector([InstitutionsAdminState])
  static getProjectsDownloadLink(state: InstitutionsAdminModel): string | null {
    return state.projects.downloadLink;
  }

  @Selector([InstitutionsAdminState])
  static getRegistrations(state: InstitutionsAdminModel): InstitutionRegistration[] {
    return state.registrations.data;
  }

  @Selector([InstitutionsAdminState])
  static getRegistrationsLoading(state: InstitutionsAdminModel): boolean {
    return state.registrations.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getRegistrationsTotalCount(state: InstitutionsAdminModel): number {
    return state.registrations.totalCount;
  }

  @Selector([InstitutionsAdminState])
  static getRegistrationsLinks(state: InstitutionsAdminModel): PaginationLinksModel | undefined {
    return state.registrations.links;
  }

  @Selector([InstitutionsAdminState])
  static getRegistrationsDownloadLink(state: InstitutionsAdminModel): string | null {
    return state.registrations.downloadLink;
  }

  @Selector([InstitutionsAdminState])
  static getPreprints(state: InstitutionsAdminModel): InstitutionPreprint[] {
    return state.preprints.data;
  }

  @Selector([InstitutionsAdminState])
  static getPreprintsLoading(state: InstitutionsAdminModel): boolean {
    return state.preprints.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getPreprintsTotalCount(state: InstitutionsAdminModel): number {
    return state.preprints.totalCount;
  }

  @Selector([InstitutionsAdminState])
  static getPreprintsLinks(state: InstitutionsAdminModel): PaginationLinksModel | undefined {
    return state.preprints.links;
  }

  @Selector([InstitutionsAdminState])
  static getPreprintsDownloadLink(state: InstitutionsAdminModel): string | null {
    return state.preprints.downloadLink;
  }

  @Selector([InstitutionsAdminState])
  static getInstitution(state: InstitutionsAdminModel): Institution {
    return state.institution.data;
  }

  @Selector([InstitutionsAdminState])
  static getInstitutionLoading(state: InstitutionsAdminModel): boolean {
    return state.institution.isLoading;
  }
}
