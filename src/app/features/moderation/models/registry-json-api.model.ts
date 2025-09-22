import { RegistrationNodeAttributesJsonApi, ResponseJsonApi } from '@osf/shared/models';

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
