import { ResponseJsonApi } from '../common';

import { BaseNodeDataJsonApi } from './base-node-data-json-api.model';

export type NodesResponseJsonApi = ResponseJsonApi<BaseNodeDataJsonApi[]>;
export type NodeResponseJsonApi = ResponseJsonApi<BaseNodeDataJsonApi>;

export interface UpdateNodeRequestModel {
  data: UpdateNodeDataJsonApi;
}

export interface CreateProjectPayloadJsoApi {
  data: {
    type: 'nodes';
    attributes: {
      title: string;
      description?: string;
      category: 'project';
      template_from?: string;
      public: boolean;
    };
    relationships: {
      region: {
        data: {
          type: 'regions';
          id: string;
        };
      };
      affiliated_institutions?: {
        data: {
          type: 'institutions';
          id: string;
        }[];
      };
    };
  };
}

interface UpdateNodeDataJsonApi {
  id: string;
  type: 'nodes';
  attributes: UpdateNodeAttributesJsonApi;
}

interface UpdateNodeAttributesJsonApi {
  description?: string;
  tags?: string[];
  public?: boolean;
  title?: string;
}
