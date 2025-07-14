import { AsyncStateModel, SubjectModel } from '@shared/models';

import { PreprintProviderDetails, PreprintProviderShortInfo } from '../../models';

export interface PreprintProvidersStateModel {
  preprintProvidersDetails: AsyncStateModel<PreprintProviderDetails[]>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderShortInfo[]>;
  preprintProvidersAllowingSubmissions: AsyncStateModel<PreprintProviderShortInfo[]>;
  highlightedSubjectsForProvider: AsyncStateModel<SubjectModel[]>;
}

export const PREPRINT_PROVIDERS_STATE_DEFAULTS = {
  preprintProvidersDetails: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintProvidersToAdvertise: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintProvidersAllowingSubmissions: {
    data: [],
    isLoading: false,
    error: null,
  },
  highlightedSubjectsForProvider: {
    data: [],
    isLoading: false,
    error: null,
  },
};
