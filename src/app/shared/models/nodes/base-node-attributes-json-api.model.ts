import { UserPermissions } from '@osf/shared/enums';

export interface BaseNodeAttributesJsonApi {
  title: string;
  description: string;
  category: string;
  custom_citation: string;
  date_created: string;
  date_modified: string;
  registration: boolean;
  preprint: boolean;
  fork: boolean;
  collection: boolean;
  tags: string[];
  access_requests_enabled: boolean;
  node_license: NodeLicenseJsonApi | null;
  analytics_key: string;
  current_user_can_comment: boolean;
  current_user_permissions: UserPermissions[];
  current_user_is_contributor: boolean;
  current_user_is_contributor_or_group_member: boolean;
  wiki_enabled: boolean;
  public: boolean;
}

export interface NodeLicenseJsonApi {
  copyright_holders: string[];
  year: string;
}
