import { ExternalIdentity, ListIdentitiesDataJsonApi } from '../models';

export function MapExternalIdentities(data: ListIdentitiesDataJsonApi[]): ExternalIdentity[] {
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
