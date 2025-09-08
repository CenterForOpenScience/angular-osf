import { Selector } from '@ngxs/store';

import { Institution } from '@shared/models';

import { InstitutionDepartment, InstitutionSearchFilter, InstitutionSummaryMetrics, InstitutionUser } from '../models';

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
  static getInstitution(state: InstitutionsAdminModel): Institution {
    return state.institution.data;
  }

  @Selector([InstitutionsAdminState])
  static getInstitutionLoading(state: InstitutionsAdminModel): boolean {
    return state.institution.isLoading;
  }
}
