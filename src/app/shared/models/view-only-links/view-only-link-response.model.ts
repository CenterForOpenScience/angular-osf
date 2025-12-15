import { ResponseJsonApi } from '../common/json-api.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type ViewOnlyLinksResponsesJsonApi = ResponseJsonApi<ViewOnlyLinkJsonApi[]>;
export type ViewOnlyLinksResponseJsonApi = ResponseJsonApi<ViewOnlyLinkJsonApi>;

export interface ViewOnlyLinkJsonApi {
  id: string;
  type: 'view_only_links';
  attributes: {
    key: string;
    date_created: string;
    anonymous: boolean;
    name: string;
  };
  embeds: {
    creator: UserDataErrorResponseJsonApi;
    nodes: {
      data: BaseNodeDataJsonApi[];
    };
  };
}
