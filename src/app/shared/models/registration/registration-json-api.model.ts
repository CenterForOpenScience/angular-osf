import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';
import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
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
  public?: boolean;
}

export interface RegistrationAttributesJsonApi {
  access_requests_enabled: boolean;
  datetime_initiated: string;
  date_modified: string;
  description: string;
  embargoed: boolean;
  archiving: boolean;
  public: boolean;
  title: string;
  revision_state: RevisionReviewStates;
  reviews_state: RegistrationReviewStates;
  pending_registration_approval: boolean;
  pending_embargo_approval: boolean;
  pending_embargo_termination_approval: boolean;
}

export interface DraftRegistrationRelationshipsJsonApi {
  registration_schema?: {
    data: {
      id: string;
      type: 'registration-schemas';
    };
  };
  provider?: {
    data: {
      id: string;
      type: 'providers';
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
    links?: {
      related: {
        href: string;
      };
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

export interface DraftRegistrationEmbedsJsonApi extends RegistrationEmbedsJsonApi {
  branched_from?: {
    data: {
      id: string;
      type: 'nodes';
      attributes: {
        title: string;
      };
      relationships?: {
        files?: {
          links: {
            related: {
              href: string;
            };
          };
        };
      };
    };
  };
}

export interface CreateRegistrationPayloadJsonApi {
  data: {
    type: 'draft_registrations';
    id: string;
    relationships?: DraftRegistrationRelationshipsJsonApi;
    attributes?: Partial<DraftRegistrationAttributesJsonApi>;
  };
}

export interface SchemaResponsesJsonApi {
  data: SchemaResponseDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export interface SchemaResponseJsonApi {
  data: SchemaResponseDataJsonApi;
}

export type SchemaResponseDataJsonApi = ApiData<
  SchemaResponseAttributesJsonApi,
  SchemaResponseEmbedsJsonApi,
  SchemaResponseRelationshipsJsonApi,
  null
>;

export interface SchemaResponseAttributesJsonApi {
  id: string;
  date_created: string;
  date_submitted: string | null;
  date_modified: string;
  revision_justification: string;
  revision_responses: Record<string, unknown>;
  updated_response_keys: string[];
  reviews_state: RevisionReviewStates;
  is_pending_current_user_approval: boolean;
  is_original_response: boolean;
}

export interface SchemaResponseRelationshipsJsonApi {
  registration_schema: {
    data: {
      id: string;
      type: 'registration-schemas';
    };
  };
  registration: {
    data: {
      id: string;
      type: 'registrations';
    };
  };
}

export interface SchemaResponseEmbedsJsonApi {
  registration: {
    data: {
      id: string;
      type: 'registrations';
      attributes: {
        title: string;
      };
      relationships: {
        files: {
          links: {
            related: {
              href: string;
            };
          };
        };
      };
    };
  };
}
