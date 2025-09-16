import { BaseProviderAttributesJsonApi } from './base-provider-json-api.model';

export interface CollectionsProviderAttributesJsonApi extends BaseProviderAttributesJsonApi {
  assets: CollectionsAssetsJsonApi;
}

export interface CollectionsAssetsJsonApi {
  favicon: string;
  style: string;
  square_color_no_transparent: string;
  square_color_transparent: string;
}
