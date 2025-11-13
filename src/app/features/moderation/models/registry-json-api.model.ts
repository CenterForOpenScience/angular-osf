import { ResponseJsonApi } from '@osf/shared/models/common/json-api.model';
import { RegistrationNodeAttributesJsonApi } from '@osf/shared/models/registration/registration-node-json-api.model';

export type RegistryResponseJsonApi = ResponseJsonApi<RegistryDataJsonApi[]>;

export interface RegistryDataJsonApi {
  id: string;
  attributes: RegistrationNodeAttributesJsonApi;
  embeds: RegistryEmbedsJsonApi;
}

export interface RegistryEmbedsJsonApi {
  schema_responses: {
    data: { id: string }[];
  };
}
