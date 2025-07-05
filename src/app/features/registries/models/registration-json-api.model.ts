import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';
import { LicenseOptions } from '@osf/shared/models';

export interface RegistrationResponseJsonApi {
  data: RegistrationDataJsonApi;
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type RegistrationDataJsonApi = ApiData<
  RegistrationAttributesJsonApi,
  null,
  RegistrationRelationshipsJsonApi,
  null
>;

interface RegistrationAttributesJsonApi {
  category: string;
  current_user_permissions: string[];
  date_created: string;
  datetime_updated: string;
  description: string;
  has_project: boolean;
  node_license: LicenseOptions;
  registration_metadata: Record<string, unknown>;
  registration_responses: Record<string, unknown>;
  tags: string[];
  title: string;
}

interface RegistrationRelationshipsJsonApi {
  registration_schema: {
    data: {
      id: string;
      type: 'registration-schemas';
    };
  };
  license: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
}
