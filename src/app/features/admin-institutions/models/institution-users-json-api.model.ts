import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';

export interface InstitutionUserAttributesJsonApi {
  user_name: string;
  department: string | null;
  orcid_id: string | null;
  public_projects: number;
  private_projects: number;
  public_registration_count: number;
  embargoed_registration_count: number;
  published_preprint_count: number;
  account_creation_date: string;
  contacts: unknown[];
  month_last_active: string;
  month_last_login: string;
  public_file_count: number;
  report_yearmonth: string;
  storage_byte_count: number;
}

export interface InstitutionUserRelationshipDataJsonApi {
  id: string;
  type: string;
}

export interface InstitutionUserRelationshipJsonApi {
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

export interface InstitutionUsersJsonApi {
  data: InstitutionUserDataJsonApi[];
  meta: MetaJsonApi;
}
