import { ReviewPermissions } from '@osf/shared/enums';
import { StringOrNull } from '@osf/shared/helpers';
import { BrandDataJsonApi } from '@osf/shared/models';

import { ProviderReviewsWorkflow } from '../enums';

import { PreprintWord } from './preprint-provider.models';

export interface PreprintProviderDetailsJsonApi {
  id: string;
  type: 'preprint-providers';
  attributes: {
    name: string;
    description: string;
    advisory_board: StringOrNull;
    example: string;
    domain: string;
    footer_links: string;
    preprint_word: PreprintWord;
    permissions: ReviewPermissions[];
    assets: {
      wide_white: string;
      square_color_no_transparent: string;
      favicon: string;
    };
    allow_submissions: boolean;
    assertions_enabled: boolean;
    reviews_workflow: ProviderReviewsWorkflow | null;
    facebook_app_id: StringOrNull;
    reviews_comments_private: StringOrNull;
    reviews_comments_anonymous: StringOrNull;
  };
  embeds?: {
    brand: {
      data: BrandDataJsonApi;
    };
  };
  links: {
    iri: string;
  };
}
