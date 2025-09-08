import { AsyncStateModel, Institution } from '@shared/models';

export interface InstitutionsSearchModel {
  institution: AsyncStateModel<Institution>;
}

export const INSTITUTIONS_SEARCH_STATE_DEFAULTS: InstitutionsSearchModel = {
  institution: {
    data: {} as Institution,
    isLoading: false,
    error: null,
  },
};
