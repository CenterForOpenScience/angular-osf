import { NodeAnalyticsModel, RelatedCountsModel } from '@osf/features/analytics/models';

export const MOCK_ANALYTICS_METRICS: NodeAnalyticsModel = {
  id: 'rid',
  type: 'analytics',
  uniqueVisits: [
    { date: '2023-01-01', count: 1 },
    { date: '2023-01-02', count: 2 },
  ],
  timeOfDay: [
    { hour: 0, count: 5 },
    { hour: 1, count: 3 },
  ],
  refererDomain: [
    { refererDomain: 'example.com', count: 4 },
    { refererDomain: 'osf.io', count: 6 },
  ],
  popularPages: [
    { path: '/', route: '/', title: 'Home', count: 7 },
    { path: '/about', route: '/about', title: 'About', count: 2 },
  ],
};

export const MOCK_RELATED_COUNTS: RelatedCountsModel = {
  id: 'rid',
  isPublic: true,
  forksCount: 1,
  linksToCount: 2,
  templateCount: 3,
};
