import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export interface PreprintProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  assets: PreprintProviderAssetsJsonApi;
  preprint_word: string;
  additional_providers: string[];
  assertions_enabled: boolean;
  advertise_on_discover_page: boolean;
  reviews_comments_private: boolean;
  reviews_comments_anonymous: boolean;
}

export interface PreprintProviderAssetsJsonApi {
  favicon: string;
  wide_white: string;
  square_color_no_transparent: string;
}
