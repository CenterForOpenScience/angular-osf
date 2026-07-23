import { BrandDataJsonApi } from '../brand/brand.json-api.model';
import { Embed } from '../common/json-api/embeds.model';
import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';

import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export type RegistrationProviderResponseJsonApi = ItemResponse<RegistryProviderDetailsJsonApi>;

export interface RegistryProviderDetailsJsonApi extends JsonApiResource<
  'registration-providers',
  RegistrationProviderAttributesJsonApi
> {
  embeds?: {
    brand: Embed<BrandDataJsonApi>;
  };
  links: ResourceLinksJsonApi;
}

export interface RegistrationProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  allow_bulk_uploads: boolean;
  allow_updates: boolean;
  assets: RegistrationAssetsJsonApi;
  branded_discovery_page: boolean;
  registration_word: string;
  reviews_comments_anonymous: boolean | null;
}

interface RegistrationAssetsJsonApi {
  square_color_no_transparent: string;
  square_color_transparent: string;
  wide_color: string;
}
