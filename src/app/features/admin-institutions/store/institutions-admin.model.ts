import { AsyncStateModel, AsyncStateWithTotalCount } from '@shared/models';

import {
  InstitutionDepartment,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionUser,
  SendMessageResponse,
} from '../models';

export interface InstitutionsAdminModel {
  departments: AsyncStateModel<InstitutionDepartment[]>;
  summaryMetrics: AsyncStateModel<InstitutionSummaryMetrics>;
  hasOsfAddonSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  storageRegionSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  searchResults: AsyncStateModel<InstitutionSearchFilter[]>;
  users: AsyncStateWithTotalCount<InstitutionUser[]>;
  sendMessage: AsyncStateModel<SendMessageResponse | null>;
  selectedInstitutionId: string | null;
  currentSearchPropertyPath: string | null;
}
