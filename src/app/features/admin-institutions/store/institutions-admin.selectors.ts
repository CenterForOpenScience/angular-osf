import { Selector } from '@ngxs/store';

import { PaginationLinksModel } from '@shared/models';

import {
  InstitutionDepartment,
  InstitutionPreprint,
  InstitutionProject,
  InstitutionRegistration,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionUser,
  SendMessageResponseJsonApi,
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
  static getDepartmentsError(state: InstitutionsAdminModel): string | null {
    return state.departments.error;
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
  static getSummaryMetricsError(state: InstitutionsAdminModel): string | null {
    return state.summaryMetrics.error;
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
  static getHasOsfAddonSearchError(state: InstitutionsAdminModel): string | null {
    return state.hasOsfAddonSearch.error;
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
  static getStorageRegionSearchError(state: InstitutionsAdminModel): string | null {
    return state.storageRegionSearch.error;
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
  static getSearchResultsError(state: InstitutionsAdminModel): string | null {
    return state.searchResults.error;
  }

  @Selector([InstitutionsAdminState])
  static getSelectedInstitutionId(state: InstitutionsAdminModel): string | null {
    return state.selectedInstitutionId;
  }

  @Selector([InstitutionsAdminState])
  static getCurrentSearchPropertyPath(state: InstitutionsAdminModel): string | null {
    return state.currentSearchPropertyPath;
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
  static getUsersError(state: InstitutionsAdminModel): string | null {
    return state.users.error;
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
  static getSendMessageResponse(state: InstitutionsAdminModel): SendMessageResponseJsonApi | null {
    return state.sendMessage.data;
  }

  @Selector([InstitutionsAdminState])
  static getSendMessageLoading(state: InstitutionsAdminModel): boolean {
    return state.sendMessage.isLoading;
  }

  @Selector([InstitutionsAdminState])
  static getSendMessageError(state: InstitutionsAdminModel): string | null {
    return state.sendMessage.error;
  }
}
