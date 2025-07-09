import { StringOrNull } from '@osf/core/helpers';

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
