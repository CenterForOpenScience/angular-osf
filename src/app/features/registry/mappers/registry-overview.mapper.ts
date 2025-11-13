import { MapRegistryStatus, RegistrationNodeMapper } from '@osf/shared/mappers/registration';

import { RegistrationOverviewDataJsonApi, RegistrationOverviewModel } from '../models';

export function MapRegistrationOverview(data: RegistrationOverviewDataJsonApi): RegistrationOverviewModel {
  const registrationAttributes = RegistrationNodeMapper.getRegistrationNodeAttributes(data.id, data.attributes);

  return {
    ...registrationAttributes,
    associatedProjectId: data.relationships?.registered_from?.data?.id,
    registrationSchemaLink: data.relationships?.registration_schema?.links?.related?.href,
    licenseId: data.relationships?.license?.data?.id,
    providerId: data.relationships?.provider?.data?.id,
    rootParentId: data.relationships.root?.data?.id,
    status: MapRegistryStatus(data.attributes),
    forksCount: 0,
  };
}
