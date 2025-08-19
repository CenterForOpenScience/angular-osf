import { ApiData } from '@osf/shared/models';

import { ExternalIdentity, ExternalIdentityResponseJsonApi } from '../models';

export function MapExternalIdentities(
  data: ApiData<ExternalIdentityResponseJsonApi, null, null, null>[]
): ExternalIdentity[] {
  const identities: ExternalIdentity[] = [];
  for (const item of data) {
    identities.push({
      id: item.id,
      externalId: item.attributes.external_id,
      status: item.attributes.status,
    });
  }
  return identities;
}
