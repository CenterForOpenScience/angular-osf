export interface BaseNodeEmbeds {
  bibliographic_contributors?: {
    data: ContributorResource[];
  };
  license?: {
    data: LicenseResource;
  };
  identifiers?: {
    data: IdentifierResource[];
  };
  affiliated_institutions?: {
    data: InstitutionResource[];
  };
}

export interface JsonApiResource<T extends string, A> {
  id: string;
  type: T;
  attributes: A;
}

export interface UserAttributes {
  full_name: string;
  given_name: string;
  middle_names?: string;
  middle_name?: string;
  family_name: string;
  suffix?: string;
}

export interface UserLinks {
  html: string;
  profile_image?: string;
  self: string;
  iri: string;
}

export interface UserResource extends JsonApiResource<'users', UserAttributes> {
  links: UserLinks;
}

export interface ContributorResource extends JsonApiResource<'contributors', Record<string, unknown>> {
  embeds?: {
    users: {
      data: UserResource;
    };
  };
}

export interface LicenseAttributes {
  name: string;
  text: string;
  url: string;
}

export type LicenseResource = JsonApiResource<'licenses', LicenseAttributes>;

export interface IdentifierAttributes {
  category: string;
  value: string;
}

export type IdentifierResource = JsonApiResource<'identifiers', IdentifierAttributes>;

export interface InstitutionAttributes {
  name: string;
  iri?: string;
  ror_uri?: string;
}

export type InstitutionResource = JsonApiResource<'institutions', InstitutionAttributes>;
