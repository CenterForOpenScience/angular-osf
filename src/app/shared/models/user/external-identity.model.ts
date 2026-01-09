export interface OrcidInfo {
  id: string;
  status: string;
}

export interface ExternalIdentityModel {
  ORCID?: OrcidInfo | null;
}
