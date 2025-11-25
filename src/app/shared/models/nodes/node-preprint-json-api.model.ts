import { ResponseJsonApi } from '../common/json-api.model';

export type NodePreprintResponseJsonApi = ResponseJsonApi<NodePreprintDataJsonApi>;
export type NodePreprintsResponseJsonApi = ResponseJsonApi<NodePreprintDataJsonApi[]>;

export interface NodePreprintDataJsonApi {
  id: string;
  attributes: NodePreprintAttributesJsonApi;
  links: NodePreprintLinksJsonApi;
}

export interface NodePreprintAttributesJsonApi {
  title: string;
  date_created: string;
  date_modified: string;
  date_published: string;
  doi: string;
  is_preprint_orphan: boolean;
  is_published: boolean;
  license_record: string;
}

export interface NodePreprintLinksJsonApi {
  html: string;
  iri: string;
  self: string;
}
