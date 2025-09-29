import { Identifier, Institution, LicenseModel } from '@osf/shared/models';
import { UserPermissions } from '@shared/enums';

export interface MetadataModel {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  resourceType?: string;
  resourceLanguage?: string;
  publicationDoi?: string;
  license: LicenseModel | null;
  category?: string;
  dateCreated: string;
  dateModified: string;
  identifiers: Identifier[];
  affiliatedInstitutions?: Institution[];
  provider?: string;
  nodeLicense?: {
    copyrightHolders: string[];
    year: string;
  };
  public?: boolean;
  currentUserPermissions: UserPermissions[];
}

export interface CustomItemMetadataRecord {
  language?: string;
  resourceTypeGeneral?: string;
  funders?: Funder[];
}

export interface Funder {
  funderName: string;
  funderIdentifier: string;
  funderIdentifierType: string;
  awardNumber: string;
  awardUri: string;
  awardTitle: string;
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
