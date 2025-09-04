import { AsyncStateModel } from '@osf/shared/models/store';

import { AnalyticsMetricsModel, RelatedCountsModel } from '../models';

export interface AnalyticsStateModel {
  metrics: AsyncStateModel<AnalyticsMetricsModel[]>;
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
