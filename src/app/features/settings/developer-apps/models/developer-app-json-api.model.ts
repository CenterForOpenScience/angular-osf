import { StringOrNull } from '@osf/shared/helpers/types.helper';

export interface DeveloperAppCreateRequestJsonApi {
  data: {
    type: 'applications';
    attributes: {
      name: string;
      description: StringOrNull;
      home_url: string;
      callback_url: string;
    };
  };
}

export interface DeveloperAppUpdateRequestJsonApi {
  data: {
    id: string;
    type: 'applications';
    attributes: {
      name: string;
      description: StringOrNull;
      home_url: string;
      callback_url: string;
    };
  };
}

export interface DeveloperAppGetResponseJsonApi {
  id: string;
  type: 'applications';
  attributes: {
    name: string;
    description: string;
    home_url: string;
    callback_url: string;
    client_id: string;
    client_secret: string;
  };
}
