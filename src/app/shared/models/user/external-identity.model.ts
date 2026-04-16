import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';

export interface OrcidInfo {
  id: string;
  status: ExternalIdentityStatus;
}

export interface ExternalIdentityModel {
  ORCID?: OrcidInfo | null;
}
