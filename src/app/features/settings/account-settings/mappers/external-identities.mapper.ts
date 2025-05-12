import { ApiData } from '@core/services/json-api/json-api.entity';
import { ExternalIdentity } from '@osf/features/settings/account-settings/models/osf-entities/external-institution.entity';
import { ExternalIdentityResponse } from '@osf/features/settings/account-settings/models/responses/list-identities-response.entity';

export function MapExternalIdentities(data: ApiData<ExternalIdentityResponse, null, null>[]): ExternalIdentity[] {
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
