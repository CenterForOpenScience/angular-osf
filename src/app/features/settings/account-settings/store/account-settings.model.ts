import { AsyncStateModel, IdName, Institution } from '@shared/models';

import { AccountEmail, AccountSettings, ExternalIdentity } from '../models';

export interface AccountSettingsStateModel {
  emails: AsyncStateModel<AccountEmail[]>;
  regions: IdName[];
  externalIdentities: ExternalIdentity[];
  accountSettings: AccountSettings;
  userInstitutions: Institution[];
}

export const ACCOUNT_SETTINGS_STATE_DEFAULTS: AccountSettingsStateModel = {
  emails: {
    data: [],
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  regions: [],
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
