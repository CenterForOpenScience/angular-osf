import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type AccountSettingsResponseJsonApi = ItemResponse<AccountSettingsDataJsonApi>;

export type AccountSettingsDataJsonApi = JsonApiResource<'user-settings', AccountSettingsAttributesJsonApi>;

interface AccountSettingsAttributesJsonApi {
  contacted_deactivation: boolean;
  deactivation_requested: boolean;
  secret: string;
  subscribe_osf_general_email: boolean;
  subscribe_osf_help_email: boolean;
  two_factor_confirmed: boolean;
  two_factor_enabled: boolean;
}
