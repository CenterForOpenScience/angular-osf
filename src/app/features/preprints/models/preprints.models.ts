import { StringOrNull } from '@core/helpers';

// domain models
export interface Brand {
  id: string;
  name: string;
  heroLogoImageUrl: string;
  heroBackgroundImageUrl: string;
  topNavLogoImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface PreprintProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  advisoryBoardHtml: StringOrNull;
  examplePreprintId: string;
  domain: string;
  footerLinksHtml: string;
  preprintWord: string;
  allowSubmissions: boolean;
  brand: Brand;
  lastFetched?: number;
  iri: string;
}

export interface PreprintProviderToAdvertise {
  id: string;
  name: string;
  whiteWideImageUrl: string;
}

export interface Subject {
  id: string;
  text: string;
  taxonomy_name: string;
  preprintProviderId: string;
}

//api models
export interface PreprintProviderDetailsGetResponse {
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

export interface BrandGetResponse {
  id: string;
  type: 'brands';
  attributes: {
    name: string;
    hero_logo_image: string;
    hero_background_image: string;
    topnav_logo_image: string;
    primary_color: string;
    secondary_color: string;
  };
}

export interface SubjectGetResponse {
  id: string;
  type: 'subjects';
  attributes: {
    text: string;
    taxonomy_name: string;
  };
}
