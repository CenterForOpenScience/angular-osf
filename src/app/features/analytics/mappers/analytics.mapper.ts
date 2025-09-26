import { NodeAnalyticsDataJsonApi, NodeAnalyticsModel, RefererDomainJsonApi, RefererDomainModel } from '../models';

export class AnalyticsMetricsMapper {
  static fromResponse(response: NodeAnalyticsDataJsonApi): NodeAnalyticsModel {
    return {
      id: response.id,
      type: response.type,
      popularPages: response.attributes.popular_pages,
      uniqueVisits: response.attributes.unique_visits,
      refererDomain: response.attributes.referer_domain.map((item) => this.getReferDomain(item)),
      timeOfDay: response.attributes.time_of_day,
    };
  }

  static getReferDomain(data: RefererDomainJsonApi): RefererDomainModel {
    return {
      refererDomain: data.referer_domain,
      count: data.count,
    };
  }
}
