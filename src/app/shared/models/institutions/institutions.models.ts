export interface InstitutionAssets {
  logo: string;
  logo_rounded: string;
  banner: string;
}

export interface InstitutionAttributes {
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

export interface UserInstitutionGetResponse {
  id: string;
  type: string;
  attributes: InstitutionAttributes;
}

export interface Institution {
  id: string;
  type: string;
  name: string;
  description: string;
  iri: string;
  rorIri: string | null;
  iris: string[];
  assets: InstitutionAssets;
  institutionalRequestAccessEnabled: boolean;
  logoPath: string;
  userMetricsUrl?: string;
  linkToExternalReportsArchive?: string;
}
