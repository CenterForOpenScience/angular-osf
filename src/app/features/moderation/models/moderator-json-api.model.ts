import { ApiData, MetaJsonApi, PaginationLinksJsonApi, UserGetResponse } from '@osf/core/models';

export interface ModeratorResponseJsonApi {
  data: ModeratorDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type ModeratorDataJsonApi = ApiData<ModeratorAttributesJsonApi, ModeratorEmbedsJsonApi, null, null>;

interface ModeratorAttributesJsonApi {
  full_name: string;
  permission_group: 'moderator' | 'admin';
}

interface ModeratorEmbedsJsonApi {
  user: {
    data: UserGetResponse;
  };
}

export interface ModeratorAddRequestModel {
  type: 'moderators';
  attributes: {
    id?: string;
    permission_group: string;
    full_name?: string;
    email?: string;
  };
  // relationships: {
  //   users?: {
  //     data?: RelationshipUsersData;
  //   };
  // };
}

interface RelationshipUsersData {
  id?: string;
  type?: 'users';
}
