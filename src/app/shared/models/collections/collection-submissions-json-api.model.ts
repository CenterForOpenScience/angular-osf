import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';

import { Embed } from '../common/json-api/embeds.model';
import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse, ItemResponse, ListResponse } from '../common/json-api/responses.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type CollectionSubmissionWithGuidResponseJsonApi = ItemResponse<CollectionSubmissionWithGuidDataJsonApi>;
export type CollectionSubmissionWithGuidListResponseJsonApi = ListResponse<CollectionSubmissionWithGuidDataJsonApi>;
export type CollectionSubmissionJsonApi = ItemResponse<CollectionSubmissionDataJsonApi>;

export interface CollectionSubmissionDataJsonApi extends JsonApiResource<
  'collection-submissions',
  CollectionSubmissionAttributesJsonApi
> {
  embeds: CollectionSubmissionEmbedsJsonApi;
}

export interface CollectionSubmissionWithGuidDataJsonApi extends JsonApiResource<
  'collection-submissions',
  CollectionSubmissionAttributesJsonApi
> {
  embeds: CollectionSubmissionWithGuidEmbedsJsonApi;
}

export type CollectionSubmissionsSearchPayloadJsonApi = DataResponse<CollectionSubmissionsSearchPayloadDataJsonApi> & {
  type: 'search';
};

interface CollectionSubmissionsSearchPayloadDataJsonApi {
  attributes: CollectionSubmissionsSearchPayloadAttributesJsonApi;
}

interface CollectionSubmissionsSearchPayloadAttributesJsonApi {
  provider: string[];
  studyDesign?: string[];
  schoolType?: string[];
  status?: string[];
  collectedType?: string[];
  volume?: string[];
  issue?: string[];
  programArea?: string[];
  dataType?: string[];
  disease?: string[];
  gradeLevels?: string[];
  q?: string;
}

interface CollectionSubmissionAttributesJsonApi {
  collected_type: string;
  data_type: string;
  disease: string;
  grade_levels: string;
  issue: string;
  program_area: string;
  reviews_state: CollectionSubmissionReviewState;
  school_type: string;
  status: string;
  study_design: string;
  volume: string;
}

interface CollectionSubmissionEmbedsJsonApi {
  collection: Embed<CollectionSubmissionCollectionEmbedDataJsonApi>;
}

interface CollectionSubmissionWithGuidEmbedsJsonApi {
  guid: Embed<BaseNodeDataJsonApi>;
  creator?: UserDataErrorResponseJsonApi;
}

interface CollectionSubmissionCollectionEmbedDataJsonApi {
  attributes: {
    title: string;
  };
  relationships: {
    provider: ToOneRelData;
    required_metadata_template?: ToOneRelData;
  };
}
