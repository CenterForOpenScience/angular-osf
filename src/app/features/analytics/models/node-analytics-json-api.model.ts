import { ResponseDataJsonApi } from '@osf/shared/models/common/json-api.model';

export type NodeAnalyticsResponseJsonApi = ResponseDataJsonApi<NodeAnalyticsDataJsonApi>;

export interface NodeAnalyticsDataJsonApi {
  id: string;
  type: 'node-analytics';
  attributes: NodeAnalyticsAttributesJsonApi;
}

export interface NodeAnalyticsAttributesJsonApi {
  popular_pages: PopularPageJsonApi[];
  unique_visits: UniqueVisitJsonApi[];
  time_of_day: TimeOfDayJsonApi[];
  referer_domain: RefererDomainJsonApi[];
}

export interface PopularPageJsonApi {
  path: string;
  route: string;
  title: string;
  count: number;
}

export interface UniqueVisitJsonApi {
  date: string;
  count: number;
}

export interface TimeOfDayJsonApi {
  hour: number;
  count: number;
}

export interface RefererDomainJsonApi {
  referer_domain: string;
  count: number;
}
