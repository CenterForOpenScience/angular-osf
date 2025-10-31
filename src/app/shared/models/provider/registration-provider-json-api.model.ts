import { BrandDataJsonApi } from '../brand/brand.json-api.model';

import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export interface RegistrationProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  allow_bulk_uploads: boolean;
  allow_updates: boolean;
  assets: RegistrationAssetsJsonApi;
  branded_discovery_page: boolean;
  registration_word: string;
  reviews_comments_anonymous: boolean | null;
}

export interface RegistrationAssetsJsonApi {
  square_color_no_transparent: string;
  square_color_transparent: string;
  wide_color: string;
}

export interface RegistryProviderDetailsJsonApi {
  id: string;
  type: 'registration-providers';
  attributes: RegistrationProviderAttributesJsonApi;
  embeds?: {
    brand: {
      data: BrandDataJsonApi;
    };
  };
  links: {
    iri: string;
  };
}
