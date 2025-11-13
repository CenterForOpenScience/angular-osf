import { UserRelatedCounts } from '@osf/shared/models/user-related-counts/user-related-counts.model';
import { UserRelatedCountsResponseJsonApi } from '@osf/shared/models/user-related-counts/user-related-counts-json-api.model';

export function MapUserCounts(response: UserRelatedCountsResponseJsonApi): UserRelatedCounts {
  return {
    projects: response.data?.relationships?.nodes?.links?.related?.meta?.count,
    registrations: response.data?.relationships?.registrations?.links?.related?.meta?.count,
    preprints: response.data?.relationships?.preprints?.links?.related?.meta?.count,
    employment: response.data?.attributes?.employment?.[0]?.institution,
    education: response.data?.attributes?.education?.[0]?.institution,
  };
}
