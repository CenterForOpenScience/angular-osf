import { AsyncStateModel, AsyncStateWithTotalCount, Institution } from '@shared/models';

import { InstitutionDepartment, InstitutionSearchFilter, InstitutionSummaryMetrics, InstitutionUser } from '../models';

export interface InstitutionsAdminModel {
  departments: AsyncStateModel<InstitutionDepartment[]>;
  summaryMetrics: AsyncStateModel<InstitutionSummaryMetrics>;
  hasOsfAddonSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  storageRegionSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  searchResults: AsyncStateModel<InstitutionSearchFilter[]>;
  users: AsyncStateWithTotalCount<InstitutionUser[]>;
  institution: AsyncStateModel<Institution>;
}

export const INSTITUTIONS_ADMIN_STATE_DEFAULTS: InstitutionsAdminModel = {
  departments: { data: [], isLoading: false, error: null },
  summaryMetrics: { data: {} as InstitutionSummaryMetrics, isLoading: false, error: null },
  hasOsfAddonSearch: { data: [], isLoading: false, error: null },
  storageRegionSearch: { data: [], isLoading: false, error: null },
  searchResults: { data: [], isLoading: false, error: null },
  users: { data: [], totalCount: 0, isLoading: false, error: null },
  institution: { data: {} as Institution, isLoading: false, error: null },
};
