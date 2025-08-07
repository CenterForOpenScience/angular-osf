import { JsonApiResponseWithPaging } from '@osf/core/models';
import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';

export type RegistryResponseJsonApi = JsonApiResponseWithPaging<RegistryDataJsonApi[], null>;

export interface RegistryDataJsonApi {
  id: string;
  attributes: RegistryAttributesJsonApi;
  embeds: RegistryEmbedsJsonApi;
}

export interface RegistryAttributesJsonApi {
  id: string;
  title: string;
  revision_state: RevisionReviewStates;
  reviews_state: RegistrationReviewStates;
  public: boolean;
  embargoed: boolean;
  embargo_end_date: string;
}

export interface RegistryEmbedsJsonApi {
  schema_responses: {
    data: { id: string }[];
  };
}
