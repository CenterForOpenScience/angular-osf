import { ApiData } from '@osf/core/models';

export type GetAccountSettingsResponseJsonApi = ApiData<AccountSettingsResponseJsonApi, null, null, null>;

export interface AccountSettingsResponseJsonApi {
  two_factor_enabled: boolean;
  two_factor_confirmed: boolean;
  subscribe_osf_general_email: boolean;
  subscribe_osf_help_email: boolean;
  deactivation_requested: boolean;
  contacted_deactivation: boolean;
  secret: string;
}
