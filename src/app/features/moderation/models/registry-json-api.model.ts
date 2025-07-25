import { JsonApiResponseWithPaging } from '@osf/core/models';

export type RegistryResponseJsonApi = JsonApiResponseWithPaging<RegistryDataJsonApi[], null>;

export interface RegistryDataJsonApi {
  id: string;
  attributes: RegistryAttributesJsonApi;
}

export interface RegistryAttributesJsonApi {
  id: string;
  title: string;
  reviews_state: string;
  public: boolean;
  embargoed: boolean;
  embargo_end_date: string;
}
