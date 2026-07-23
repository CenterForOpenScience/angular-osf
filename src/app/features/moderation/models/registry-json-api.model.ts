import { ToManyRel } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { RegistrationNodeAttributesJsonApi } from '@osf/shared/models/registration/registration-node-json-api.model';

export type RegistryResponseJsonApi = ListResponse<RegistryDataJsonApi>;

export interface RegistryDataJsonApi extends JsonApiResource<'registrations', RegistrationNodeAttributesJsonApi> {
  embeds: RegistryEmbedsJsonApi;
}

interface RegistryEmbedsJsonApi {
  schema_responses: ToManyRel<'schema-responses'>;
}
