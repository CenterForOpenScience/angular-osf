import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';
import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { BrandDataJsonApi } from '@osf/shared/models/brand/brand.json-api.model';
import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { ResourceLinksJsonApi } from '@osf/shared/models/common/json-api/links.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';

import { ProviderReviewsWorkflow } from '../enums';

import { PreprintWord } from './preprint-provider.model';

export type PreprintProviderResponseJsonApi = ItemResponse<PreprintProviderDetailsJsonApi>;
export type PreprintProvidersListResponseJsonApi = ListResponse<PreprintProviderDetailsJsonApi>;

export interface PreprintProviderDetailsJsonApi extends JsonApiResource<
  'preprint-providers',
  PreprintProviderAttributesJsonApi
> {
  embeds?: PreprintProviderEmbedsJsonApi;
  links: ResourceLinksJsonApi;
}

interface PreprintProviderAttributesJsonApi {
  advisory_board: StringOrNull;
  allow_submissions: boolean;
  assertions_enabled: boolean;
  assets: PreprintProviderAssetsJsonApi;
  description: string;
  domain: string;
  example: string;
  facebook_app_id: StringOrNull;
  footer_links: string;
  name: string;
  permissions: ReviewPermissions[];
  preprint_word: PreprintWord;
  reviews_comments_anonymous: StringOrNull;
  reviews_comments_private: StringOrNull;
  reviews_workflow: ProviderReviewsWorkflow | null;
}

interface PreprintProviderAssetsJsonApi {
  favicon: string;
  square_color_no_transparent: string;
  wide_white: string;
}

interface PreprintProviderEmbedsJsonApi {
  brand?: Embed<BrandDataJsonApi>;
}
