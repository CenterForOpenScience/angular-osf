import { InstitutionsJsonApiResponse, NodeData, ResponseDataJsonApi } from '@osf/shared/models';

export type NodeResponseJsonApi = ResponseDataJsonApi<NodeDataJsonApi>;

export interface NodeDataJsonApi extends NodeData {
  embeds: NodeEmbedsJsonApi;
}

interface NodeEmbedsJsonApi {
  region: {
    data: {
      id: string;
      attributes: {
        name: string;
      };
    };
  };
  affiliated_institutions: InstitutionsJsonApiResponse;
}
