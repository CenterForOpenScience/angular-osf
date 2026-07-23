import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type CollectionDetailsItemResponseJsonApi = ItemResponse<CollectionDetailsDataJsonApi>;
export type CollectionDetailsListResponseJsonApi = ListResponse<CollectionDetailsDataJsonApi>;
export type SparseCollectionsResponseJsonApi = ListResponse<SparseCollectionDataJsonApi>;

export interface CollectionDetailsDataJsonApi extends JsonApiResource<
  'collections',
  CollectionDetailsAttributesJsonApi
> {
  links?: Pick<ResourceLinksJsonApi, 'iri'>;
}
export type SparseCollectionDataJsonApi = JsonApiResource<'collections', SparseCollectionAttributesJsonApi>;

interface CollectionDetailsAttributesJsonApi {
  bookmarks: boolean;
  collected_type_choices: string[];
  data_type_choices: string[];
  date_created: string;
  date_modified: string;
  disease_choices: string[];
  grade_levels_choices: string[];
  is_promoted: boolean;
  is_public: boolean;
  issue_choices: string[];
  program_area_choices: string[];
  school_type_choices: string[];
  status_choices: string[];
  study_design_choices: string[];
  title: string;
  volume_choices: string[];
}

interface SparseCollectionAttributesJsonApi {
  bookmarks: boolean;
  title: string;
}
