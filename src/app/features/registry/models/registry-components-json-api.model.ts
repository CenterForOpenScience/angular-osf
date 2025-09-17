import { ContributorResponse, MetaJsonApi, RegistrationNodeAttributesJsonApi } from '@osf/shared/models';

import { RegistryComponentModel } from './registry-components.models';

export interface RegistryComponentJsonApi {
  id: string;
  type: string;
  attributes: RegistrationNodeAttributesJsonApi;
  embeds: {
    bibliographic_contributors: {
      data: ContributorResponse[];
    };
  };
}

export interface RegistryComponentsJsonApiResponse {
  data: RegistryComponentJsonApi[];
  meta: MetaJsonApi;
}

export interface RegistryComponentsResponseJsonApi {
  data: RegistryComponentModel[];
  meta: MetaJsonApi;
}
