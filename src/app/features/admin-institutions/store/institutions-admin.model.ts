import { AsyncStateModel, AsyncStateWithLinksModel, AsyncStateWithTotalCount, Institution } from '@shared/models';

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

export interface InstitutionsAdminModel {
  departments: AsyncStateModel<InstitutionDepartment[]>;
  summaryMetrics: AsyncStateModel<InstitutionSummaryMetrics>;
  hasOsfAddonSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  storageRegionSearch: AsyncStateModel<InstitutionSearchFilter[]>;
  searchResults: AsyncStateModel<InstitutionSearchFilter[]>;
  users: AsyncStateWithTotalCount<InstitutionUser[]>;
  projects: AsyncStateWithLinksModel<InstitutionProject[]>;
  registrations: AsyncStateWithLinksModel<InstitutionRegistration[]>;
  preprints: AsyncStateWithLinksModel<InstitutionPreprint[]>;
  sendMessage: AsyncStateModel<SendMessageResponseJsonApi | null>;
  selectedInstitutionId: string | null;
  currentSearchPropertyPath: string | null;
  institution: AsyncStateModel<Institution>;
}

export const INSTITUTIONS_ADMIN_STATE_DEFAULTS: InstitutionsAdminModel = {
  departments: { data: [], isLoading: false, error: null },
  summaryMetrics: { data: {} as InstitutionSummaryMetrics, isLoading: false, error: null },
  hasOsfAddonSearch: { data: [], isLoading: false, error: null },
  storageRegionSearch: { data: [], isLoading: false, error: null },
  searchResults: { data: [], isLoading: false, error: null },
  users: { data: [], totalCount: 0, isLoading: false, error: null },
  projects: { data: [], totalCount: 0, isLoading: false, error: null, links: undefined },
  registrations: { data: [], totalCount: 0, isLoading: false, error: null, links: undefined },
  preprints: { data: [], totalCount: 0, isLoading: false, error: null, links: undefined },
  sendMessage: { data: null, isLoading: false, error: null },
  selectedInstitutionId: null,
  currentSearchPropertyPath: null,
  institution: { data: {} as Institution, isLoading: false, error: null },
};
