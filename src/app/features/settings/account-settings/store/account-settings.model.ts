import { AsyncStateModel, Institution } from '@shared/models';

import { AccountSettings, ExternalIdentity } from '../models';

export interface AccountSettingsStateModel {
  externalIdentities: ExternalIdentity[];
  accountSettings: AsyncStateModel<AccountSettings | null>;
  userInstitutions: Institution[];
}

export const ACCOUNT_SETTINGS_STATE_DEFAULTS: AccountSettingsStateModel = {
  externalIdentities: [],
  accountSettings: {
    data: null,
    isLoading: false,
    error: null,
  },
  userInstitutions: [],
};
