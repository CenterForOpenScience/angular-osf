import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';
import { ContributorDataJsonApi } from '@osf/shared/models/contributors/contributor-response-json-api.model';
import { RegistrationNodeAttributesJsonApi } from '@osf/shared/models/registration/registration-node-json-api.model';

import { RegistryComponentModel } from './registry-components.models';

export interface RegistryComponentJsonApi {
  id: string;
  type: string;
  attributes: RegistrationNodeAttributesJsonApi;
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
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
