import { ApiData, MetaJsonApi, PaginationLinksJsonApi, UserDataJsonApi } from '@osf/shared/models';

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
    data: UserDataJsonApi;
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
}
