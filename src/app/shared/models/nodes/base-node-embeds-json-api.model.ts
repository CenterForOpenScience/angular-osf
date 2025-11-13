import { ContributorDataJsonApi } from '../contributors/contributor-response-json-api.model';
import { IdentifierAttributes, IdentifiersJsonApiData } from '../identifiers/identifier-json-api.model';
import { InstitutionDataJsonApi } from '../institutions/institution-json-api.model';
import { LicenseDataJsonApi } from '../license/licenses-json-api.model';
import { RegionDataJsonApi } from '../regions/regions.json-api.model';

import { BaseNodeDataJsonApi } from './base-node-data-json-api.model';

export interface BaseNodeEmbedsJsonApi {
  affiliated_institutions?: {
    data: InstitutionDataJsonApi[];
  };
  bibliographic_contributors?: {
    data: ContributorDataJsonApi[];
  };
  identifiers?: {
    data: IdentifiersJsonApiData[];
  };
  license?: {
    data: LicenseDataJsonApi;
  };
  region?: {
    data: RegionDataJsonApi;
  };
  parent?: {
    data: BaseNodeDataJsonApi;
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

export type IdentifierResource = JsonApiResource<'identifiers', IdentifierAttributes>;

export interface InstitutionAttributes {
  name: string;
  iri?: string;
  ror_uri?: string;
}

export type InstitutionResource = JsonApiResource<'institutions', InstitutionAttributes>;
