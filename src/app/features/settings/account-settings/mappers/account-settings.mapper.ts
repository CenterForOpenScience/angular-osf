import { ApiData } from '@core/services/json-api/json-api.entity';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-models/account-settings.model';
import { AccountSettingsResponse } from '@osf/features/settings/account-settings/models/responses/get-account-settings-response.entity';

export function MapAccountSettings(data: ApiData<AccountSettingsResponse, null, null>): AccountSettings {
  return {
    twoFactorEnabled: data.attributes.two_factor_enabled,
    twoFactorConfirmed: data.attributes.two_factor_confirmed,
    subscribeOsfGeneralEmail: data.attributes.subscribe_osf_general_email,
    subscribeOsfHelpEmail: data.attributes.subscribe_osf_help_email,
    deactivationRequested: data.attributes.deactivation_requested,
    contactedDeactivation: data.attributes.contacted_deactivation,
    secret: data.attributes.secret,
  };
}
