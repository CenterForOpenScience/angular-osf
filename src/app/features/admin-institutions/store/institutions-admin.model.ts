import { AsyncStateModel, AsyncStateWithTotalCount, Institution, PaginationLinksModel } from '@shared/models';

import {
  InstitutionDepartment,
  InstitutionRegistration,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionUser,
} from '../models';

export interface InstitutionsAdminModel {
  departments: AsyncStateModel<InstitutionDepartment[]>;
  summaryMetrics: AsyncStateModel<InstitutionSummaryMetrics>;
  hasOsfAddonSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  storageRegionSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  searchResults: AsyncStateModel<InstitutionSearchFilter[]>;
  users: AsyncStateWithTotalCount<InstitutionUser[]>;
  registrations: ResultStateModel<InstitutionRegistration[]>;
  institution: AsyncStateModel<Institution>;
}

interface ResultStateModel<T> extends AsyncStateWithTotalCount<T> {
  links?: PaginationLinksModel;
  downloadLink: string | null;
}

export const INSTITUTIONS_ADMIN_STATE_DEFAULTS: InstitutionsAdminModel = {
  departments: { data: [], isLoading: false, error: null },
  summaryMetrics: { data: {} as InstitutionSummaryMetrics, isLoading: false, error: null },
  hasOsfAddonSearch: { data: [], isLoading: false, error: null },
  storageRegionSearch: { data: [], isLoading: false, error: null },
  searchResults: { data: [], isLoading: false, error: null },
  users: { data: [], totalCount: 0, isLoading: false, error: null },
  registrations: { data: [], totalCount: 0, isLoading: false, error: null, links: undefined, downloadLink: null },
  institution: { data: {} as Institution, isLoading: false, error: null },
};
