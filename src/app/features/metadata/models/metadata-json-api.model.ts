import { ApiData, InstitutionsJsonApiResponse, LicenseDataJsonApi, LicenseRecordJsonApi } from '@osf/shared/models';

export interface MetadataJsonApiResponse {
  data: MetadataJsonApi;
}

export type MetadataJsonApi = ApiData<MetadataAttributesJsonApi, MetadataEmbedsJsonApi, null, null>;

export interface MetadataAttributesJsonApi {
  title: string;
  description: string;
  tags: string[];
  date_created: string;
  date_modified: string;
  article_doi?: string;
  doi?: boolean;
  category?: string;
  node_license?: LicenseRecordJsonApi;
  public?: boolean;
}

interface MetadataEmbedsJsonApi {
  identifiers: {
    data: { id: string; type: string; attributes: { category: string; value: string } }[];
  };
  license: {
    data: LicenseDataJsonApi;
  };
  affiliated_institutions: InstitutionsJsonApiResponse;
  provider?: {
    data: { id: string; type: string; attributes: { name: string } };
  };
}

export interface CustomMetadataJsonApiResponse {
  data: CustomMetadataJsonApi;
}

export type CustomMetadataJsonApi = ApiData<CustomMetadataAttributesJsonApi, MetadataEmbedsJsonApi, null, null>;

export interface CustomMetadataAttributesJsonApi {
  language?: string;
  resource_type_general?: string;
  funders?: FunderJsonApi[];
}

export interface FunderJsonApi {
  funder_name: string;
  funder_identifier: string;
  funder_identifier_type: string;
  award_number: string;
  award_uri: string;
  award_title: string;
}
