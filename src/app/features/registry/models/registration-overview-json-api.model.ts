import { ResponseJsonApi } from '@shared/models/common/json-api.model';
import { RegistrationNodeAttributesJsonApi } from '@shared/models/registration/registration-node-json-api.model';

export type RegistrationOverviewResponse = ResponseJsonApi<RegistrationOverviewDataJsonApi>;

export interface RegistrationOverviewDataJsonApi {
  id: string;
  attributes: RegistrationNodeAttributesJsonApi;
  relationships: RegistryOverviewJsonApiRelationships;
}

export interface RegistryOverviewJsonApiRelationships {
  registered_from: {
    data: {
      id: string;
    };
  };
  registration_schema: {
    links: {
      related: {
        href: string;
      };
    };
  };
  root: {
    data: {
      id: string;
      type: string;
    };
  };
  license: {
    data: {
      id: string;
    };
  };
  provider: {
    data: {
      id: string;
    };
  };
}
