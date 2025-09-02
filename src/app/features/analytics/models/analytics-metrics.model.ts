export interface AnalyticsMetricsGetResponse {
  id: string;
  type: string;
  attributes: AnalyticsMetricsAttributes;
}

interface AnalyticsMetricsAttributes {
  popular_pages: [];
  unique_visits: [];
  time_of_day: [];
  referer_domain: [];
}

export interface AnalyticsMetricsModel {
  id: string;
  type: string;
  popularPages: PopularPage[];
  uniqueVisits: UniqueVisit[];
  timeOfDay: TimeOfDay[];
  refererDomain: RefererDomain[];
  lastFetched?: number;
}

export interface PopularPage {
  path: string;
  route: string;
  title: string;
  count: number;
}

export interface UniqueVisit {
  date: string;
  count: number;
}

export interface TimeOfDay {
  hour: number;
  count: number;
}

export interface RefererDomain {
  refererDomain: string;
  count: number;
}
