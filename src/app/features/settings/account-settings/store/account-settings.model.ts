import { Institution } from '@shared/models';

import { AccountSettings, ExternalIdentity } from '../models';

export interface AccountSettingsStateModel {
  externalIdentities: ExternalIdentity[];
  accountSettings: AccountSettings;
  userInstitutions: Institution[];
}

export const ACCOUNT_SETTINGS_STATE_DEFAULTS: AccountSettingsStateModel = {
  externalIdentities: [],
  accountSettings: {
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfGeneralEmail: false,
    subscribeOsfHelpEmail: false,
    deactivationRequested: false,
    contactedDeactivation: false,
    secret: '',
  },
  userInstitutions: [],
};
