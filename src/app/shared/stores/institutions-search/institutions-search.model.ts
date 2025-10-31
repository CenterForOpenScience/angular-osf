import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

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
