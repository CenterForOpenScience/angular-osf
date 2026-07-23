import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type NodeAnalyticsResponseJsonApi = ItemResponse<NodeAnalyticsDataJsonApi>;

export type NodeAnalyticsDataJsonApi = JsonApiResource<'node-analytics', NodeAnalyticsAttributesJsonApi>;

interface NodeAnalyticsAttributesJsonApi {
  popular_pages: PopularPageJsonApi[];
  unique_visits: UniqueVisitJsonApi[];
  time_of_day: TimeOfDayJsonApi[];
  referer_domain: RefererDomainJsonApi[];
}

interface PopularPageJsonApi {
  path: string;
  route: string;
  title: string;
  count: number;
}

interface UniqueVisitJsonApi {
  date: string;
  count: number;
}

interface TimeOfDayJsonApi {
  hour: number;
  count: number;
}

export interface RefererDomainJsonApi {
  referer_domain: string;
  count: number;
}
