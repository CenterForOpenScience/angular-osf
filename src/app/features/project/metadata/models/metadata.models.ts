export interface ProjectMetadata {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  resource_type?: string;
  resource_language?: string;
  funding_info?: FundingInfo[];
  publication_doi?: string;
  doi?: string;
}

export interface CustomItemMetadataRecord {
  language?: string;
  resource_type_general?: string;
  funders?: Funder[];
}

export interface Funder {
  funder_name: string;
  funder_identifier: string;
  funder_identifier_type: string;
  award_number: string;
  award_uri: string;
  award_title: string;
}

export interface CustomItemMetadataResponse {
  data: {
    type: 'custom-item-metadata-records';
    attributes: CustomItemMetadataRecord;
  };
}

export interface CrossRefFundersResponse {
  status: string;
  'message-type': string;
  'message-version': string;
  message: CrossRefFundersMessage;
}

export interface CrossRefFundersMessage {
  'items-per-page': number;
  query: CrossRefQuery;
  'total-results': number;
  items: CrossRefFunder[];
}

export interface CrossRefQuery {
  'start-index': number;
  'search-terms': string | null;
}

export interface CrossRefFunder {
  id: string;
  location: string;
  name: string;
  'alt-names': string[];
  uri: string;
  replaces: string[];
  'replaced-by': string[];
  tokens: string[];
}

export interface FundingInfo {
  funder_name: string;
  award_title?: string;
  award_number?: string;
  award_uri?: string;
}

export interface LicenseData {
  name: string;
  year?: string;
  copyright_holders?: string[];
  statement_of_purpose?: string;
}

export interface ResourceInformation {
  resourceType: string;
  resourceLanguage: string;
}

export interface MetadataResponse {
  data: {
    type: string;
    id: string;
    attributes: ProjectMetadata;
  };
}

export interface MetadataUpdateResponse {
  data: {
    type: string;
    id: string;
    attributes: ProjectMetadata;
  };
}

export interface UserInstitution {
  id: string;
  type: string;
  attributes: {
    name: string;
    description?: string;
    assets?: {
      logo?: string;
    };
  };
}

export interface UserInstitutionsResponse {
  data: UserInstitution[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
    meta: {
      total: number;
      per_page: number;
    };
  };
  meta: {
    version: string;
  };
}
