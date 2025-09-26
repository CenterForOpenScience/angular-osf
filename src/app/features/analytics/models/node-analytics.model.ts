export interface NodeAnalyticsModel {
  id: string;
  type: string;
  popularPages: PopularPageModel[];
  uniqueVisits: UniqueVisitModel[];
  timeOfDay: TimeOfDayModel[];
  refererDomain: RefererDomainModel[];
  lastFetched?: number;
}

export interface PopularPageModel {
  path: string;
  route: string;
  title: string;
  count: number;
}

export interface UniqueVisitModel {
  date: string;
  count: number;
}

export interface TimeOfDayModel {
  hour: number;
  count: number;
}

export interface RefererDomainModel {
  refererDomain: string;
  count: number;
}
