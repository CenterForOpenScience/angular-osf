import { AsyncStateModel } from '@shared/models';

import { InstitutionDepartment, InstitutionSearchFilter, InstitutionSummaryMetrics } from '../models';

export interface InstitutionsAdminModel {
  departments: AsyncStateModel<InstitutionDepartment[]>;
  summaryMetrics: AsyncStateModel<InstitutionSummaryMetrics>;
  hasOsfAddonSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  storageRegionSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  searchResults: AsyncStateModel<InstitutionSearchFilter[]>;
  selectedInstitutionId: string | null;
  currentSearchPropertyPath: string | null;
}
