export interface RegistryInstitutionJsonApi {
  id: string;
  type: string;
  attributes: {
    name: string;
  };
  links: {
    self: string;
    html: string;
    iri: string;
  };
}

export interface RegistryInstitutionsJsonApiResponse {
  data: RegistryInstitutionJsonApi[];
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
