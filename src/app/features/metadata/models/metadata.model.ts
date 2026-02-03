import { UserPermissions } from '@shared/enums/user-permissions.enum';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';
import { Institution } from '@shared/models/institutions/institutions.models';
import { LicenseModel } from '@shared/models/license/license.model';

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
  identifiers: IdentifierModel[];
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
