import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';
import { LicenseRecordJsonApi } from '@osf/shared/models';

export interface DraftRegistrationResponseJsonApi {
  data: DraftRegistrationDataJsonApi;
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export interface RegistrationResponseJsonApi {
  data: RegistrationDataJsonApi;
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type DraftRegistrationDataJsonApi = ApiData<
  DraftRegistrationAttributesJsonApi,
  DraftRegistrationEmbedsJsonApi,
  DraftRegistrationRelationshipsJsonApi,
  null
>;

export type RegistrationDataJsonApi = ApiData<
  RegistrationAttributesJsonApi,
  RegistrationEmbedsJsonApi,
  RegistrationRelationshipsJsonApi,
  null
>;

export interface DraftRegistrationAttributesJsonApi {
  category: string;
  date_created: string;
  datetime_initiated: string;
  datetime_updated: string;
  description: string;
  has_project: boolean;
  node_license: LicenseRecordJsonApi;
  registration_metadata: Record<string, unknown>;
  registration_responses: Record<string, unknown>;
  tags: string[];
  title: string;
}

export interface RegistrationAttributesJsonApi {
  access_requests_enabled: boolean;
  datetime_initiated: string;
  date_modified: string;
  description: string;
  embargoed: boolean;
  archiving: boolean;
  title: string;
}

export interface DraftRegistrationRelationshipsJsonApi {
  registration_schema?: {
    data: {
      id: string;
      type: 'registration-schemas';
    };
  };
  license?: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
  branched_from?: {
    data: {
      id: string;
      type: 'nodes';
    };
  };
}

export interface RegistrationRelationshipsJsonApi {
  registration_schema?: {
    data: {
      id: string;
      type: 'registration-schemas';
    };
  };
  license?: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
}

export interface RegistrationEmbedsJsonApi {
  registration_schema?: {
    data: {
      attributes: {
        name: string;
      };
    };
  };
  bibliographic_contributors?: {
    data: {
      id: string;
      type: 'users';
      embeds: {
        users: {
          data: {
            attributes: {
              full_name: string;
            };
            id: string;
          };
        };
      };
    }[];
  };
  provider?: {
    data: {
      attributes: {
        name: string;
      };
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DraftRegistrationEmbedsJsonApi extends RegistrationEmbedsJsonApi {}

export interface CreateRegistrationPayloadJsonApi {
  data: {
    type: 'draft_registrations';
    id: string;
    relationships?: DraftRegistrationRelationshipsJsonApi;
    attributes?: Partial<DraftRegistrationAttributesJsonApi>;
  };
}
