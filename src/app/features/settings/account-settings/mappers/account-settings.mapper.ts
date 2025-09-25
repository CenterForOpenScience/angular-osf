import { AccountSettings, AccountSettingsDataJsonApi } from '../models';

export class AccountSettingsMapper {
  static getAccountSettings(data: AccountSettingsDataJsonApi): AccountSettings {
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

  static getEmailSettingsRequest(accountSettings: Partial<AccountSettings>): Record<string, string> {
    return {
      subscribe_osf_general_email: `${accountSettings.subscribeOsfGeneralEmail}`,
      subscribe_osf_help_email: `${accountSettings.subscribeOsfHelpEmail}`,
    };
  }
}
