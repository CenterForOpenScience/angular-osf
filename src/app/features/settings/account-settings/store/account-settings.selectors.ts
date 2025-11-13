import { Selector } from '@ngxs/store';

import { Institution } from '@osf/shared/models/institutions/institutions.models';

import { AccountSettings, ExternalIdentity } from '../models';

import { AccountSettingsStateModel } from './account-settings.model';
import { AccountSettingsState } from './account-settings.state';

export class AccountSettingsSelectors {
  @Selector([AccountSettingsState])
  static getExternalIdentities(state: AccountSettingsStateModel): ExternalIdentity[] {
    return state.externalIdentities;
  }

  @Selector([AccountSettingsState])
  static getAccountSettings(state: AccountSettingsStateModel): AccountSettings | null {
    return state.accountSettings.data;
  }

  @Selector([AccountSettingsState])
  static areAccountSettingsLoading(state: AccountSettingsStateModel): boolean {
    return state.accountSettings.isLoading;
  }

  @Selector([AccountSettingsState])
  static getTwoFactorEnabled(state: AccountSettingsStateModel): boolean {
    return state.accountSettings.data?.twoFactorEnabled ?? false;
  }

  @Selector([AccountSettingsState])
  static getTwoFactorSecret(state: AccountSettingsStateModel): string {
    return state.accountSettings.data?.secret ?? '';
  }

  @Selector([AccountSettingsState])
  static getUserInstitutions(state: AccountSettingsStateModel): Institution[] {
    return state.userInstitutions;
  }
}
