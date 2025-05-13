import { Institution } from '@osf/features/institutions/entities/institutions.models';
import { AccountEmail } from '@osf/features/settings/account-settings/models/osf-models/account-email.model';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-models/account-settings.model';
import { ExternalIdentity } from '@osf/features/settings/account-settings/models/osf-models/external-institution.model';
import { Region } from '@osf/features/settings/account-settings/models/osf-models/region.model';

export interface AccountSettingsStateModel {
  emails: AccountEmail[];
  emailsLoading: boolean;
  regions: Region[];
  externalIdentities: ExternalIdentity[];
  accountSettings: AccountSettings;
  userInstitutions: Institution[];
}
