import { JsonApiResponse } from '@osf/core/models';

export type RegistryActionsResponseJsonApi = JsonApiResponse<RegistryActionsDataJsonApi[], null>;

export interface RegistryActionsDataJsonApi {
  id: string;
  attributes: RegistryActionAttributesJsonApi;
  embeds: RegistryActionEmbedsJsonApi;
}

interface RegistryActionAttributesJsonApi {
  auto: boolean;
  comment: string;
  date_created: string;
  date_modified: string;
  from_state: string;
  to_state: string;
  trigger: string;
  visible: true;
}

interface RegistryActionEmbedsJsonApi {
  creator: {
    data: UserModelJsonApi;
  };
}

interface UserModelJsonApi {
  id: string;
  type: 'users';
  attributes: UserAttributesJsonApi;
}

interface UserAttributesJsonApi {
  full_name: string;
}
