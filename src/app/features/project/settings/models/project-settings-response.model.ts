import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type ProjectSettingsResponseJsonApi = ItemResponse<ProjectSettingsDataJsonApi>;

export type ProjectSettingsDataJsonApi = JsonApiResource<'node-settings', ProjectSettingsAttributesJsonApi>;

export interface ProjectSettingsAttributesJsonApi {
  access_requests_enabled: boolean;
  anyone_can_edit_wiki: boolean;
  wiki_enabled: boolean;
}
