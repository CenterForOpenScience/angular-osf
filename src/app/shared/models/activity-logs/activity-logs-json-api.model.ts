import { Embed } from '../common/json-api/embeds.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { UserDataJsonApi } from '../user/user-json-api.model';

export type ActivityLogsResponseJsonApi = ListResponse<ActivityLogDataJsonApi>;

export interface ActivityLogDataJsonApi extends JsonApiResource<'activity-logs', ActivityLogAttributesJsonApi> {
  embeds?: ActivityLogEmbedsJsonApi;
}

interface ActivityLogAttributesJsonApi {
  action: string;
  date: string;
  foreign_user: string | null;
  params: ActivityLogParamsJsonApi;
}

interface ActivityLogParamsJsonApi {
  addon?: string;
  anonymous_link?: boolean;
  contributors?: LogContributorJsonApi[];
  destination?: ActivityLogDestinationJsonApi;
  file?: ActivityLogFileJsonApi;
  github_user?: string;
  identifiers?: ActivityLogIdentifiersJsonApi;
  institution?: ActivityLogInstitutionJsonApi;
  kind?: string;
  license?: string;
  old_page?: string;
  page?: string;
  page_id?: string;
  params_node: ActivityLogParamsNodeJsonApi;
  params_project: null;
  pointer: PointerJsonApi | null;
  preprint?: string;
  preprint_provider?: string | ActivityLogPreprintProviderJsonApi | null;
  source?: ActivityLogSourceJsonApi;
  tag?: string;
  template_node?: ActivityLogTemplateNodeJsonApi;
  title_new?: string;
  title_original?: string;
  updated_fields?: Record<string, ActivityLogUpdatedFieldJsonApi>;
  urls?: ActivityLogUrlsJsonApi;
  value?: string;
  version?: string;
  wiki?: ActivityLogWikiJsonApi;
}

interface ActivityLogEmbedsJsonApi {
  linked_node?: Embed<BaseNodeDataJsonApi>;
  original_node?: Embed<BaseNodeDataJsonApi>;
  user?: Embed<UserDataJsonApi>;
}

interface ActivityLogDestinationJsonApi {
  addon: string;
  materialized: string;
  url: string;
}

interface ActivityLogFileJsonApi {
  name: string;
  url: string;
}

interface ActivityLogIdentifiersJsonApi {
  ark?: string;
  doi?: string;
}

interface ActivityLogInstitutionJsonApi {
  id: string;
  name: string;
}

interface ActivityLogParamsNodeJsonApi {
  id: string;
  title: string;
}

interface ActivityLogPreprintProviderJsonApi {
  name: string;
  url: string;
}

interface ActivityLogSourceJsonApi {
  addon: string;
  materialized: string;
}

interface ActivityLogTemplateNodeJsonApi {
  id: string;
  title: string;
  url: string;
}

interface ActivityLogUpdatedFieldJsonApi {
  new: string;
  old: string;
}

interface ActivityLogUrlsJsonApi {
  view: string;
}

interface ActivityLogWikiJsonApi {
  name: string;
  url: string;
}

export interface LogContributorJsonApi {
  active: boolean;
  family_name: string;
  full_name: string;
  given_name: string;
  id: string;
  middle_names: string;
  unregistered_name: string | null;
}

interface PointerJsonApi {
  category: string;
  id: string;
  title: string;
  url: string;
}
