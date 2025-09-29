import { ResponseDataJsonApi } from '@osf/shared/models';

export type AccountSettingsResponseJsonApi = ResponseDataJsonApi<AccountSettingsDataJsonApi>;

export interface AccountSettingsDataJsonApi {
  id: string;
  type: 'user-settings';
  attributes: AccountSettingsAttributesJsonApi;
}

export interface AccountSettingsAttributesJsonApi {
  contacted_deactivation: boolean;
  deactivation_requested: boolean;
  secret: string;
  subscribe_osf_general_email: boolean;
  subscribe_osf_help_email: boolean;
  two_factor_confirmed: boolean;
  two_factor_enabled: boolean;
}
