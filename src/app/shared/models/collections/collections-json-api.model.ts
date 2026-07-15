import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';

import { BrandDataJsonApi } from '../brand/brand.json-api.model';
import { JsonApiResponse } from '../common/json-api.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { CollectionsProviderAttributesJsonApi } from '../provider/collections-provider-json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export interface CollectionProviderResponseJsonApi {
  id: string;
  type: string;
  links?: {
    iri?: string;
  };
  attributes: CollectionsProviderAttributesJsonApi;
  embeds: {
    brand: {
      data?: BrandDataJsonApi;
    };
    required_metadata_template?: {
      data?: CedarMetadataDataTemplateJsonApi | null;
    };
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

export interface CollectionDetailsResponseJsonApi {
  id: string;
  type: string;
  links?: {
    iri?: string;
  };
  attributes: {
    title: string;
    date_created: string;
    date_modified: string;
    bookmarks: boolean;
    is_promoted: boolean;
    is_public: boolean;
  };
}

export interface CollectionSubmissionJsonApi {
  id: string;
  type: string;
  attributes: {
    reviews_state: CollectionSubmissionReviewState;
  };
  embeds: {
    collection: {
      data: {
        attributes: {
          title: string;
        };
        relationships: {
          provider: {
            data: {
              id: string;
            };
          };
          required_metadata_template?: {
            data?: {
              id: string;
              type: string;
            } | null;
          };
        };
      };
    };
  };
}

export interface CollectionSubmissionWithGuidJsonApi {
  id: string;
  type: string;
  attributes: {
    reviews_state: CollectionSubmissionReviewState;
  };
  embeds: {
    guid: {
      data: BaseNodeDataJsonApi;
    };
    creator?: UserDataErrorResponseJsonApi;
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

export interface CollectionDetailsGetResponseJsonApi extends JsonApiResponse<CollectionDetailsResponseJsonApi, null> {
  data: CollectionDetailsResponseJsonApi;
}
