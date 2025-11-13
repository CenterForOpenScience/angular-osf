import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { NodeAnalyticsModel, RelatedCountsModel } from '../models';

export interface AnalyticsStateModel {
  metrics: AsyncStateModel<NodeAnalyticsModel[]>;
  relatedCounts: AsyncStateModel<RelatedCountsModel[]>;
}

export const ANALYTICS_DEFAULT_STATE: AnalyticsStateModel = {
  metrics: {
    data: [],
    isLoading: false,
    error: '',
  },
  relatedCounts: {
    data: [],
    isLoading: false,
    error: '',
  },
};
