import { Institution } from '@osf/features/institutions/entities/institutions.models';
import { AccountEmail } from '@osf/features/settings/account-settings/models/osf-entities/account-email.entity';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-entities/account-settings.entity';
import { ExternalIdentity } from '@osf/features/settings/account-settings/models/osf-entities/external-institution.entity';
import { Region } from '@osf/features/settings/account-settings/models/osf-entities/region.entity';

export interface AccountSettingsStateModel {
  emails: AccountEmail[];
  emailsLoading: boolean;
  regions: Region[];
  externalIdentities: ExternalIdentity[];
  accountSettings: AccountSettings;
  userInstitutions: Institution[];
}
