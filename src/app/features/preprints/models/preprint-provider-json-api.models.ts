import { StringOrNull } from '@core/helpers';
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
    preprint_word: string;
    assets: {
      wide_white: string;
      square_color_no_transparent: string;
      favicon: string;
    };
    allow_submissions: boolean;
    assertions_enabled: boolean;
    reviews_workflow: StringOrNull;
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
