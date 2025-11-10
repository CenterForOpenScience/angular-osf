import { ResponseJsonApi } from '../common/json-api.model';

export type NodeStorageResponseJsonApi = ResponseJsonApi<NodeStorageDataJsonApi>;

export interface NodeStorageDataJsonApi {
  id: string;
  type: 'node-storage';
  attributes: NodeStorageAttributesJsonApi;
  links: NodeStorageLinksJsonApi;
}

export interface NodeStorageAttributesJsonApi {
  storage_limit_status: string;
  storage_usage: string;
}

export interface NodeStorageLinksJsonApi {
  self: string;
  iri: string;
}
