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
  faviconUrl: string;
}

export interface PreprintProviderShortInfo {
  id: string;
  name: string;
  descriptionHtml: string;
  whiteWideImageUrl: string;
  squareColorNoTransparentImageUrl: string;
}

export interface Subject {
  id: string;
  text: string;
  taxonomy_name: string;
  preprintProviderId: string;
}

export interface Preprint {
  id: string;
  dateCreated: string;
  dateModified: string;
  title: string;
  description: string;
  isPublished: boolean;
  tags: string[];
  isPublic: boolean;
  version: number;
  isLatestVersion: boolean;
  primaryFileId: StringOrNull;
}

export interface PreprintFilesLinks {
  filesLink: string;
  uploadFileLink: string;
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

export interface PreprintJsonApi {
  date_created: string;
  date_modified: string;
  date_published: Date | null;
  original_publication_date: Date | null;
  custom_publication_citation: StringOrNull;
  doi: StringOrNull;
  preprint_doi_created: Date | null;
  title: string;
  description: string;
  is_published: boolean;
  is_preprint_orphan: boolean;
  license_record: StringOrNull;
  tags: string[];
  date_withdrawn: Date | null;
  current_user_permissions: string[];
  public: boolean;
  reviews_state: string;
  date_last_transitioned: Date | null;
  version: number;
  is_latest_version: boolean;
  has_coi: boolean;
  conflict_of_interest_statement: StringOrNull;
  has_data_links: boolean;
}

export interface PreprintsRelationshipsJsonApi {
  primary_file: {
    links: {
      related: {
        href: string;
      };
    };
  };
}
