import { StringOrNull } from '@core/helpers';
import { BrandGetResponse } from '@shared/models';

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
  };
  embeds?: {
    brand: {
      data: BrandGetResponse;
    };
  };
  links: {
    iri: string;
  };
}
