import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export interface PreprintProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  additional_providers: string[];
  advertise_on_discover_page: boolean;
  assertions_enabled: boolean;
  assets: PreprintProviderAssetsJsonApi;
  preprint_word: string;
  reviews_comments_anonymous: boolean;
  reviews_comments_private: boolean;
}

export interface PreprintProviderAssetsJsonApi {
  favicon: string;
  square_color_no_transparent: string;
  wide_white: string;
}
