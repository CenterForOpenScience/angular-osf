import { MetaJsonApi } from '@core/models';

export interface InstitutionUserContactJsonApi {
  sender_name: string;
  count: number;
}

export interface InstitutionUserAttributesJsonApi {
  report_yearmonth: string;
  user_name: string;
  department: string | null;
  orcid_id: string | null;
  month_last_login: string;
  month_last_active: string;
  account_creation_date: string;
  public_projects: number;
  private_projects: number;
  public_registration_count: number;
  embargoed_registration_count: number;
  published_preprint_count: number;
  public_file_count: number;
  storage_byte_count: number;
  contacts: InstitutionUserContactJsonApi[];
}

export interface InstitutionUserRelationshipDataJsonApi {
  id: string;
  type: string;
}

export interface InstitutionUserRelationshipLinksJsonApi {
  related: {
    href: string;
    meta: Record<string, unknown>;
  };
}

export interface InstitutionUserRelationshipJsonApi {
  links: InstitutionUserRelationshipLinksJsonApi;
  data: InstitutionUserRelationshipDataJsonApi;
}

export interface InstitutionUserRelationshipsJsonApi {
  user: InstitutionUserRelationshipJsonApi;
  institution: InstitutionUserRelationshipJsonApi;
}

export interface InstitutionUserDataJsonApi {
  id: string;
  type: 'institution-users';
  attributes: InstitutionUserAttributesJsonApi;
  relationships: InstitutionUserRelationshipsJsonApi;
  links: Record<string, unknown>;
}

export interface InstitutionUsersLinksJsonApi {
  self: string;
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface InstitutionUsersJsonApi {
  data: InstitutionUserDataJsonApi[];
  meta: MetaJsonApi;
  links: InstitutionUsersLinksJsonApi;
}
