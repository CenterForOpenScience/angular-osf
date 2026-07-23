import { EmbedList } from '../common/json-api/embeds.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';
import { ContributorDataJsonApi } from '../contributors/contributor-response-json-api.model';

export type MyResourcesResponseJsonApi = ListResponse<MyResourcesItemGetResponseJsonApi>;
export type MyResourcesItemResponseJsonApi = ItemResponse<MyResourcesItemGetResponseJsonApi>;

export interface MyResourcesItemGetResponseJsonApi extends JsonApiResource<string, MyResourcesItemAttributesJsonApi> {
  embeds: MyResourcesItemEmbedsJsonApi;
}

interface MyResourcesItemAttributesJsonApi {
  date_created: string;
  date_modified: string;
  public: boolean;
  title: string;
}

interface MyResourcesItemEmbedsJsonApi {
  bibliographic_contributors: EmbedList<ContributorDataJsonApi>;
}
