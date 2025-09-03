import { Selector } from '@ngxs/store';

import { AnalyticsStateModel } from './analytics.model';
import { AnalyticsState } from './analytics.state';

export class AnalyticsSelectors {
  @Selector([AnalyticsState])
  static getMetrics(projectId: string) {
    return (state: { analytics: AnalyticsStateModel }) =>
      state.analytics.metrics.data.find((metric) => metric.id.includes(projectId));
  }

  @Selector([AnalyticsState])
  static isMetricsLoading(state: AnalyticsStateModel) {
    return state.metrics.isLoading || false;
  }

  @Selector([AnalyticsState])
  static isMetricsError(state: AnalyticsStateModel) {
    return !!state.metrics.error?.length;
  }

  @Selector([AnalyticsState])
  static getRelatedCounts(projectId: string) {
    return (state: { analytics: AnalyticsStateModel }) =>
      state.analytics.relatedCounts.data.find((relatedCount) => relatedCount.id.includes(projectId));
  }

  @Selector([AnalyticsState])
  static isRelatedCountsLoading(state: AnalyticsStateModel) {
    return state.relatedCounts.isLoading || false;
  }
}
