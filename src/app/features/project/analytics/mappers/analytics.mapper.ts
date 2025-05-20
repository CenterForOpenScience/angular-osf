import { AnalyticsMetricsGetResponse, AnalyticsMetricsModel } from '../models';

export class AnalyticsMetricsMapper {
  static fromResponse(response: AnalyticsMetricsGetResponse): AnalyticsMetricsModel {
    return {
      id: response.id,
      type: response.type,
      popularPages: response.attributes.popular_pages,
      uniqueVisits: response.attributes.unique_visits,
      refererDomain: response.attributes.referer_domain,
      timeOfDay: response.attributes.time_of_day,
    };
  }
}
