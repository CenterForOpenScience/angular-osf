import {
  BaseNodeDataJsonApi,
  InstitutionsJsonApiResponse,
  RegionDataJsonApi,
  ResponseDataJsonApi,
} from '@osf/shared/models';

export type NodeResponseJsonApi = ResponseDataJsonApi<NodeDataJsonApi>;

export interface NodeDataJsonApi extends BaseNodeDataJsonApi {
  embeds: NodeEmbedsJsonApi;
}

interface NodeEmbedsJsonApi {
  region: {
    data: RegionDataJsonApi;
  };
  affiliated_institutions: InstitutionsJsonApiResponse;
}
