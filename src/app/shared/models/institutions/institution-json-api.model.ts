import { ApiData, InstitutionAssets, JsonApiResponse, ResponseJsonApi } from '@shared/models';

export type InstitutionsJsonApiResponse = JsonApiResponse<InstitutionDataJsonApi[], null>;
export type InstitutionsWithMetaJsonApiResponse = ResponseJsonApi<InstitutionDataJsonApi[]>;
export type InstitutionJsonApiResponse = JsonApiResponse<InstitutionDataJsonApi, null>;

export type InstitutionDataJsonApi = ApiData<
  InstitutionAttributesJsonApi,
  null,
  InstitutionRelationshipsJsonApi,
  InstitutionLinksJsonApi
>;

interface InstitutionAttributesJsonApi {
  name: string;
  description: string;
  iri: string;
  ror_iri: string | null;
  iris: string[];
  assets: InstitutionAssets;
  institutional_request_access_enabled: boolean;
  logo_path: string;
  link_to_external_reports_archive: string;
}

interface InstitutionLinksJsonApi {
  self: string;
  html: string;
  iri: string;
}

interface InstitutionRelationshipsJsonApi {
  nodes: {
    links: {
      related: {
        href: string;
        meta: Record<string, unknown>;
      };
    };
  };
  registrations: {
    links: {
      related: {
        href: string;
        meta: Record<string, unknown>;
      };
    };
  };
  users: {
    links: {
      related: {
        href: string;
        meta: Record<string, unknown>;
      };
    };
  };
  user_metrics: {
    links: {
      related: {
        href: string;
        meta: Record<string, unknown>;
      };
    };
  };
}
