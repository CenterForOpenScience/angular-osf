import { ResourceLinksJsonApi } from '../common/json-api/links.model';

import { BaseNodeAttributesJsonApi } from './base-node-attributes-json-api.model';
import { BaseNodeEmbedsJsonApi } from './base-node-embeds-json-api.model';
import { BaseNodeRelationships } from './base-node-relationships-json-api.model';

export interface BaseNodeDataJsonApi {
  id: string;
  type: 'nodes';
  attributes: BaseNodeAttributesJsonApi;
  links: ResourceLinksJsonApi;
  relationships: BaseNodeRelationships;
  embeds?: BaseNodeEmbedsJsonApi;
}
