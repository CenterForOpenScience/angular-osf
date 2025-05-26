import { UserCountsResponse } from '@osf/shared/models/resource-card/user-counts-response.model';
import { UserRelatedDataCounts } from '@osf/shared/models/resource-card/user-related-data-counts.model';

export function MapUserCounts(response: UserCountsResponse): UserRelatedDataCounts {
  return {
    projects: response.data?.relationships?.nodes?.links?.related?.meta?.count,
    registrations: response.data?.relationships?.registrations?.links?.related?.meta?.count,
    preprints: response.data?.relationships?.preprints?.links?.related?.meta?.count,
    employment: response.data?.attributes?.employment?.[0]?.institution,
    education: response.data?.attributes?.education?.[0]?.institution,
  };
}
