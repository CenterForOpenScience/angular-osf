import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export interface RegistrationProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  assets: RegistrationAssetsJsonApi;
  branded_discovery_page: boolean;
  reviews_comments_anonymous: boolean | null;
  allow_updates: boolean;
  allow_bulk_uploads: boolean;
  registration_word: string;
}

export interface RegistrationAssetsJsonApi {
  square_color_no_transparent: string;
  square_color_transparent: string;
  wide_color: string;
}
