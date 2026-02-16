export interface RorAdmin {
  created: {
    date: string;
    schema_version: string;
  };
  last_modified: {
    date: string;
    schema_version: string;
  };
}

export interface RorExternalId {
  all: string[];
  preferred: string | null;
  type: 'grid' | 'fundref' | 'isni' | 'wikidata';
}

export interface RorLink {
  type: 'website' | 'wikipedia';
  value: string;
}

export interface RorGeonamesDetails {
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  country_subdivision_code: string;
  country_subdivision_name: string;
  lat: number;
  lng: number;
  name: string;
}

export interface RorLocation {
  geonames_details: RorGeonamesDetails;
  geonames_id: number;
}

export interface RorName {
  lang: string | null;
  types: ('ror_display' | 'label' | 'alias' | 'acronym')[];
  value: string;
}

export interface RorRelationship {
  type: string;
  id: string;
  label: string;
}

export interface RorOrganization {
  id: string;
  admin: RorAdmin;
  domains: string[];
  established: number | null;
  external_ids: RorExternalId[];
  links: RorLink[];
  locations: RorLocation[];
  names: RorName[];
  relationships: RorRelationship[];
  status: 'active' | 'inactive' | 'withdrawn';
  types: (
    | 'education'
    | 'healthcare'
    | 'company'
    | 'archive'
    | 'nonprofit'
    | 'government'
    | 'facility'
    | 'other'
    | 'funder'
  )[];
}

export interface RorMetaCount {
  id: string;
  title: string;
  count: number;
}

export interface RorMeta {
  types: RorMetaCount[];
  countries: RorMetaCount[];
  continents: RorMetaCount[];
  statuses: RorMetaCount[];
}

export interface RorSearchResponse {
  items: RorOrganization[];
  meta: RorMeta;
  number_of_results: number;
  time_taken: number;
}

export interface RorFunderOption {
  id: string;
  name: string;
}

export interface RorDisplayData {
  id: string;
  displayName: string;
  acronym?: string;
  type: string;
  country: string;
  city: string;
  established?: number;
  website?: string;
  status: string;
}
