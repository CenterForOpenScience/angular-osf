import { AsyncStateModel, AsyncStateWithTotalCount, Institution } from '@osf/shared/models';

export interface InstitutionsStateModel {
  userInstitutions: AsyncStateModel<Institution[]>;
  institutions: AsyncStateWithTotalCount<Institution[]>;
  resourceInstitutions: AsyncStateModel<Institution[]>;
}

export const INSTITUTIONS_STATE_DEFAULTS: InstitutionsStateModel = {
  userInstitutions: {
    data: [],
    isLoading: false,
    error: null,
  },
  institutions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  resourceInstitutions: {
    data: [],
    isLoading: false,
    error: null,
  },
};
