import { Selector } from '@ngxs/store';

import { Institution } from '@osf/features/institutions/entities/institutions.models';
import { AccountEmail } from '@osf/features/settings/account-settings/models/osf-entities/account-email.entity';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-entities/account-settings.entity';
import { ExternalIdentity } from '@osf/features/settings/account-settings/models/osf-entities/external-institution.entity';
import { Region } from '@osf/features/settings/account-settings/models/osf-entities/region.entity';
import { AccountSettingsStateModel } from '@osf/features/settings/account-settings/store/account-settings.model';
import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';

export class AccountSettingsSelectors {
  @Selector([AccountSettingsState])
  static getEmails(state: AccountSettingsStateModel): AccountEmail[] {
    return state.emails;
  }

  @Selector([AccountSettingsState])
  static isEmailsLoading(state: AccountSettingsStateModel): boolean {
    return state.emailsLoading;
  }

  @Selector([AccountSettingsState])
  static getRegions(state: AccountSettingsStateModel): Region[] {
    return state.regions;
  }

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
