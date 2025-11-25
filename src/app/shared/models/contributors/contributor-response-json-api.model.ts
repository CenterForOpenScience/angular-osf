import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

import { ResponseJsonApi } from '../common/json-api.model';
import { UserDataJsonApi, UserErrorResponseJsonApi } from '../user/user-json-api.model';

export type ContributorResponseJsonApi = ResponseJsonApi<ContributorDataJsonApi>;
export type ContributorsResponseJsonApi = ResponseJsonApi<ContributorDataJsonApi[]>;

export interface ContributorDataJsonApi {
  id: string;
  type: string;
  attributes: ContributorAttributesJsonApi;
  relationships: ContributorRelationshipsJsonApi;
  embeds: ContributorEmbedsJsonApi;
}

export interface ContributorAttributesJsonApi {
  bibliographic: boolean;
  index: number;
  is_curator: boolean;
  permission: ContributorPermission;
  unregistered_contributor: string | null;
}

export interface ContributorRelationshipsJsonApi {
  users: RelationshipJsonApi<UserRelationshipDataJsonApi>;
  node: RelationshipJsonApi<NodeRelationshipDataJsonApi>;
}

export interface ContributorEmbedsJsonApi {
  users: EmbeddedUsersJsonApi;
}

export interface ContributorAddRequestModel {
  type: 'contributors';
  id?: string;
  attributes: {
    bibliographic: boolean;
    permission: string;
    id?: string;
    index?: number;
    full_name?: string;
    email?: string;
    child_nodes?: string[];
  };
  relationships: {
    users?: {
      data?: RelationshipUsersDataJsonApi;
    };
  };
}

interface RelationshipUsersDataJsonApi {
  id?: string;
  type?: 'users';
}

export interface EmbeddedUsersJsonApi {
  data: UserDataJsonApi;
  errors?: UserErrorResponseJsonApi[];
}

interface RelationshipJsonApi<T> {
  links: {
    related: LinkWithMetaJsonApi;
    self?: LinkWithMetaJsonApi;
  };
  data?: T | null;
}

interface LinkWithMetaJsonApi {
  href: string;
  meta: Record<string, unknown>;
}

interface UserRelationshipDataJsonApi {
  id: string;
  type: string;
}

interface NodeRelationshipDataJsonApi {
  id: string;
  type: string;
}
