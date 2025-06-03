import { ApiData } from '@osf/core/models';

export type GetAccountSettingsResponse = ApiData<AccountSettingsResponse, null, null, null>;

export interface AccountSettingsResponse {
  two_factor_enabled: boolean;
  two_factor_confirmed: boolean;
  subscribe_osf_general_email: boolean;
  subscribe_osf_help_email: boolean;
  deactivation_requested: boolean;
  contacted_deactivation: boolean;
  secret: string;
}
