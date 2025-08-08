import { StringOrNull } from '@core/helpers';
import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintWord } from '@osf/features/preprints/models/preprint-provider.models';
import { BrandDataJsonApi } from '@shared/models';

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
