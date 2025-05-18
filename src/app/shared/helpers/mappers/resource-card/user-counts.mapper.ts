import { UserCountsResponse } from '@shared/entities/resource-card/user-counts-response.entity';
import { UserRelatedDataCounts } from '@shared/entities/resource-card/user-related-data-counts.entity';

export function MapUserCounts(response: UserCountsResponse): UserRelatedDataCounts {
  return {
    projects: response.data?.relationships?.nodes?.links?.related?.meta?.count,
    registrations: response.data?.relationships?.registrations?.links?.related?.meta?.count,
    preprints: response.data?.relationships?.preprints?.links?.related?.meta?.count,
    employment: response.data?.attributes?.employment?.[0]?.institution,
    education: response.data?.attributes?.education?.[0]?.institution,
  };
}
