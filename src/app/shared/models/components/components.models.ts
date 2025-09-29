import { UserPermissions } from '@osf/shared/enums';

import { ContributorDataJsonApi, ContributorModel } from '../contributors';

export interface ComponentOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  public: boolean;
  contributors: ContributorModel[];
  currentUserPermissions: UserPermissions[];
}

export interface ComponentGetResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    public: boolean;
    current_user_permissions?: UserPermissions[];
  };
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
}
