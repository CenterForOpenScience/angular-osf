import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse, ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';

import { ScopeJsonApiResponse } from './scope-json-api.model';

export type TokensListResponseJsonApi = ListResponse<TokenDataJsonApi>;
export type TokenResponseJsonApi = ItemResponse<TokenDataJsonApi>;

export interface TokenDataJsonApi extends JsonApiResource<'tokens', TokenAttributesJsonApi> {
  embeds: TokenEmbedsJsonApi;
}

export type TokenCreateRequestJsonApi = DataResponse<TokenCreateDataJsonApi>;

interface TokenCreateDataJsonApi {
  attributes: TokenCreateAttributesJsonApi;
  type: 'tokens';
}

interface TokenCreateAttributesJsonApi {
  name: string;
  scopes: string;
}

interface TokenAttributesJsonApi {
  name: string;
  token_id: string;
}

interface TokenEmbedsJsonApi {
  scopes: ScopeJsonApiResponse;
}
