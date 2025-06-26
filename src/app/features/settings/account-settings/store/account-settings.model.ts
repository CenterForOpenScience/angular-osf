import { Institution } from '@shared/models';

import { AccountEmail, AccountSettings, ExternalIdentity, Region } from '../models';

export interface AccountSettingsStateModel {
  emails: AccountEmail[];
  emailsLoading: boolean;
  regions: Region[];
  externalIdentities: ExternalIdentity[];
  accountSettings: AccountSettings;
  userInstitutions: Institution[];
}
