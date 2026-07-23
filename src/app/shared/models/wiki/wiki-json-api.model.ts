import { UserDataErrorResponseJsonApi } from '@shared/models/user/user-json-api.model';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type WikiResponseJsonApi = ListResponse<WikiDataJsonApi>;
export type WikiItemResponseJsonApi = ItemResponse<WikiDataJsonApi>;
export type WikiVersionResponseJsonApi = ListResponse<WikiVersionJsonApi>;
export type WikiVersionItemResponseJsonApi = ItemResponse<WikiVersionJsonApi>;

export interface WikiDataJsonApi extends JsonApiResource<'wikis', WikiAttributesJsonApi> {
  links: WikiLinksJsonApi;
}

export interface WikiVersionJsonApi extends JsonApiResource<'wiki-versions', WikiVersionAttributesJsonApi> {
  embeds: WikiVersionEmbedsJsonApi;
}

interface WikiAttributesJsonApi {
  name: string;
  kind: string;
  content_type: string;
  date_modified: string;
}

interface WikiLinksJsonApi {
  download: string;
}

interface WikiVersionAttributesJsonApi {
  date_created: string;
}

interface WikiVersionEmbedsJsonApi {
  user: UserDataErrorResponseJsonApi;
}
