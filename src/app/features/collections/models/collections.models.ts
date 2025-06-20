import { JsonApiResponse } from '@core/models';

export interface CollectionProviderResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    advisory_board: string;
    example: string | null;
    domain: string;
    domain_redirect_enabled: boolean;
    footer_links: string;
    email_support: boolean | null;
    facebook_app_id: string | null;
    allow_submissions: boolean;
    allow_commenting: boolean;
    assets: {
      style?: string;
      square_color_transparent?: string;
      square_color_no_transparent?: string;
      favicon?: string;
    };
    share_source: string;
    share_publish_type: string;
    permissions: string[];
    reviews_workflow: string;
  };
  relationships: {
    primary_collection: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface SparseCollectionAttributesJsonApi {
  title: string;
  bookmarks: boolean;
}

export interface SparseCollectionJsonAi {
  id: string;
  attributes: SparseCollectionAttributesJsonApi;
}

export interface SparseCollectionsResponseJsonApi {
  data: SparseCollectionJsonAi[];
}

export interface CollectionProvider {
  id: string;
  type: string;
  name: string;
  description: string;
  advisoryBoard: string;
  example: string | null;
  domain: string;
  domainRedirectEnabled: boolean;
  footerLinks: string;
  emailSupport: boolean | null;
  facebookAppId: string | null;
  allowSubmissions: boolean;
  allowCommenting: boolean;
  assets: {
    style?: string;
    squareColorTransparent?: string;
    squareColorNoTransparent?: string;
    favicon?: string;
  };
  shareSource: string;
  sharePublishType: string;
  permissions: string[];
  reviewsWorkflow: string;
  primaryCollection: {
    id: string;
    type: string;
  };
}

export interface CollectionProviderGetResponseJsonApi extends JsonApiResponse<CollectionProviderResponseJsonApi, null> {
  data: CollectionProviderResponseJsonApi;
}
