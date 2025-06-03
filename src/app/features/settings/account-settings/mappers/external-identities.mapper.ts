import { ApiData } from '@osf/core/models';

import { ExternalIdentity, ExternalIdentityResponse } from '../models';

export function MapExternalIdentities(data: ApiData<ExternalIdentityResponse, null, null, null>[]): ExternalIdentity[] {
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
