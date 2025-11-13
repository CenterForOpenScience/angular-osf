import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

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
