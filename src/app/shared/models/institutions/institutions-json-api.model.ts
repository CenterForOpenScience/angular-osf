import { Institution, InstitutionAttributes } from '@shared/models';

export interface InstitutionRelationships {
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
}

export interface InstitutionLinks {
  self: string;
  html: string;
  iri: string;
}

export interface InstitutionData {
  id: string;
  type: string;
  attributes: InstitutionAttributes;
  relationships: InstitutionRelationships;
  links: InstitutionLinks;
}

export interface InstitutionsResponseLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
  meta: {
    total: number;
    per_page: number;
  };
}

export interface FetchInstitutionsJsonApi {
  data: InstitutionData[];
  links: InstitutionsResponseLinks;
  meta: {
    version: string;
  };
}

export interface GetGeneralInstitutionsResponse {
  data: Institution[];
  total: number;
}
