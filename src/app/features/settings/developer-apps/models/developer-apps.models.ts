import { StringOrNull } from '@osf/core/helpers';

//Domain models
export interface DeveloperApp {
  id: string;
  name: string;
  description: StringOrNull;
  projHomePageUrl: string;
  authorizationCallbackUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface DeveloperAppCreateUpdate {
  id?: string;
  name: string;
  description: StringOrNull;
  projHomePageUrl: string;
  authorizationCallbackUrl: string;
}

// API Request/Response Models
export interface DeveloperAppCreateRequest {
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

export interface DeveloperAppUpdateRequest {
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

export interface DeveloperAppGetResponse {
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
