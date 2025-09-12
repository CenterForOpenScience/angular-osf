import { Selector } from '@ngxs/store';

import { Institution } from '@shared/models';

import { AccountSettings, ExternalIdentity } from '../models';

import { AccountSettingsStateModel } from './account-settings.model';
import { AccountSettingsState } from './account-settings.state';

export class AccountSettingsSelectors {
  @Selector([AccountSettingsState])
  static getExternalIdentities(state: AccountSettingsStateModel): ExternalIdentity[] {
    return state.externalIdentities;
  }

  @Selector([AccountSettingsState])
  static getAccountSettings(state: AccountSettingsStateModel): AccountSettings | undefined {
    return state.accountSettings;
  }

  @Selector([AccountSettingsState])
  static getTwoFactorEnabled(state: AccountSettingsStateModel): boolean {
    return state.accountSettings?.twoFactorEnabled ?? false;
  }

  @Selector([AccountSettingsState])
  static getTwoFactorSecret(state: AccountSettingsStateModel): string {
    return state.accountSettings?.secret ?? '';
  }

  @Selector([AccountSettingsState])
  static getUserInstitutions(state: AccountSettingsStateModel): Institution[] {
    return state.userInstitutions;
  }
}
