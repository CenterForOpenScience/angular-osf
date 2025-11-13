import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

export interface BaseNodeAttributesJsonApi {
  access_requests_enabled: boolean;
  analytics_key: string;
  category: string;
  collection: boolean;
  current_user_can_comment: boolean;
  current_user_is_contributor: boolean;
  current_user_is_contributor_or_group_member: boolean;
  current_user_permissions: UserPermissions[];
  custom_citation: string;
  date_created: string;
  date_modified: string;
  description: string;
  fork: boolean;
  node_license: NodeLicenseJsonApi | null;
  preprint: boolean;
  public: boolean;
  registration: boolean;
  tags: string[];
  title: string;
  wiki_enabled: boolean;
}

export interface NodeLicenseJsonApi {
  copyright_holders: string[];
  year: string;
}
