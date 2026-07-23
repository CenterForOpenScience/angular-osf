import { RelationshipLinks, ToOneRelData } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@shared/models/common/json-api/responses.model';
import { RegistrationNodeAttributesJsonApi } from '@shared/models/registration/registration-node-json-api.model';

export type RegistrationOverviewResponse = ItemResponse<RegistrationOverviewDataJsonApi>;

export interface RegistrationOverviewDataJsonApi extends JsonApiResource<
  'registrations',
  RegistrationNodeAttributesJsonApi
> {
  relationships: RegistryOverviewRelationshipsJsonApi;
}

interface RegistryOverviewRelationshipsJsonApi {
  license: ToOneRelData<'licenses'>;
  provider: ToOneRelData<'registration-providers'>;
  registered_from: ToOneRelData<'nodes'>;
  registration_schema: {
    links: RelationshipLinks;
  };
  root: ToOneRelData<'registrations'>;
}
