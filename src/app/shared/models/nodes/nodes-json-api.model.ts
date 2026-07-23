import { ToManyRelData, ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse, ItemResponse, ListResponse } from '../common/json-api/responses.model';

import { BaseNodeDataJsonApi } from './base-node-data-json-api.model';

export type NodesResponseJsonApi = ListResponse<BaseNodeDataJsonApi>;
export type NodeResponseJsonApi = ItemResponse<BaseNodeDataJsonApi>;

export type UpdateNodeRequestModel = DataResponse<UpdateNodeDataJsonApi>;
export type CreateProjectPayloadJsoApi = DataResponse<CreateProjectDataJsonApi>;

type UpdateNodeDataJsonApi = JsonApiResource<'nodes', UpdateNodeAttributesJsonApi>;

interface CreateProjectDataJsonApi extends Omit<JsonApiResource<'nodes', CreateProjectAttributesJsonApi>, 'id'> {
  relationships: CreateProjectRelationshipsJsonApi;
}

interface UpdateNodeAttributesJsonApi {
  description?: string;
  tags?: string[];
  public?: boolean;
  title?: string;
}

interface CreateProjectAttributesJsonApi {
  title: string;
  description?: string;
  category: 'project';
  template_from?: string;
  public: boolean;
}

interface CreateProjectRelationshipsJsonApi {
  region: ToOneRelData<'regions'>;
  affiliated_institutions?: ToManyRelData<'institutions'>;
}
