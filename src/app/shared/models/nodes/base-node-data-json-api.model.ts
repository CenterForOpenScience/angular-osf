import { BaseNodeAttributesJsonApi } from './base-node-attributes-json-api.model';
import { BaseNodeLinksJsonApi } from './base-node-links-json-api.model';
import { BaseNodeRelationships } from './base-node-relationships-json-api.model';

export interface BaseNodeDataJsonApi {
  id: string;
  type: 'nodes';
  attributes: BaseNodeAttributesJsonApi;
  links: BaseNodeLinksJsonApi;
  relationships: BaseNodeRelationships;
}
