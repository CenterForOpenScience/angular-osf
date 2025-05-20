import { AsyncStateModel } from '@osf/shared/models/store';

import { AnalyticsMetricsModel, RelatedCountsModel } from '../models';

export interface AnalyticsStateModel {
  metrics: AsyncStateModel<AnalyticsMetricsModel[]>;
  relatedCounts: AsyncStateModel<RelatedCountsModel[]>;
}
