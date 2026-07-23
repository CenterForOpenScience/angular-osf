import { ToOneRel } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type InstitutionUsersJsonApi = ListResponse<InstitutionUserDataJsonApi>;

export interface InstitutionUserDataJsonApi extends JsonApiResource<
  'institution-users',
  InstitutionUserAttributesJsonApi
> {
  relationships: InstitutionUserRelationshipsJsonApi;
}

interface InstitutionUserAttributesJsonApi {
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

interface InstitutionUserRelationshipsJsonApi {
  user: ToOneRel<'user'>;
  institution: ToOneRel<'institution'>;
}
