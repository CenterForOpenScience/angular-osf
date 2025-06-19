export interface LicenseAttributes {
  name: string;
  text: string;
  url: string;
  required_fields: string[];
}

export interface LicenseLinks {
  self: string;
}

export interface License {
  id: string;
  type: string;
  attributes: LicenseAttributes;
  links: LicenseLinks;
}

export interface LicensesApiResponse {
  data: License[];
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

export interface LicensesStateModel {
  licenses: License[];
  loading: boolean;
  error: string | null;
}
