export interface InstitutionsWithTotalCount {
  data: Institution[];
  total: number;
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

export interface InstitutionAssets {
  logo: string;
  logo_rounded: string;
  banner: string;
}
