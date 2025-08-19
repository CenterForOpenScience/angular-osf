import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import { ResponseJsonApi } from '@osf/shared/models';

export type RegistryResponseJsonApi = ResponseJsonApi<RegistryDataJsonApi[]>;

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
