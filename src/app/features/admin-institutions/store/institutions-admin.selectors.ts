import { Selector } from '@ngxs/store';

import { InstitutionDepartment, InstitutionSearchFilter, InstitutionSummaryMetrics } from '../models';

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
}
