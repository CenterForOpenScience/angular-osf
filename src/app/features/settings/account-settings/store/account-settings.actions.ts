import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-models/account-settings.model';

export class GetEmails {
  static readonly type = '[AccountSettings] Get Emails';
}

export class AddEmail {
  static readonly type = '[AccountSettings] Add Email';

  constructor(public email: string) {}
}

export class DeleteEmail {
  static readonly type = '[AccountSettings] Remove Email';

  constructor(public email: string) {}
}

export class VerifyEmail {
  static readonly type = '[AccountSettings] Verify Email';

  constructor(
    public userId: string,
    public emailId: string
  ) {}
}

export class MakePrimary {
  static readonly type = '[AccountSettings] Make Primary';

  constructor(public userId: string) {}
}

export class GetRegions {
  static readonly type = '[AccountSettings] Get Regions';
}

export class UpdateRegion {
  static readonly type = '[AccountSettings] Update Region';

  constructor(public regionId: string) {}
}

export class UpdateIndexing {
  static readonly type = '[AccountSettings] Update Indexing';

  constructor(public allowIndexing: boolean) {}
}

export class GetExternalIdentities {
  static readonly type = '[AccountSettings] Get External Identities';
}

export class DeleteExternalIdentity {
  static readonly type = '[AccountSettings] Delete ExternalIdentities';

  constructor(public externalId: string) {}
}

export class GetUserInstitutions {
  static readonly type = '[AccountSettings] Get User Institutions';
}

export class DeleteUserInstitution {
  static readonly type = '[AccountSettings] Delete User Institution';

  constructor(
    public id: string,
    public userId: string
  ) {}
}

export class GetAccountSettings {
  static readonly type = '[AccountSettings] Get AccountSettings';
}

export class UpdateAccountSettings {
  static readonly type = '[AccountSettings] Update Account Settings';

  constructor(public accountSettings: Record<string, string>) {}
}

export class DisableTwoFactorAuth {
  static readonly type = '[AccountSettings] Disable Two-Factor Auth';
}

export class EnableTwoFactorAuth {
  static readonly type = '[AccountSettings] Enable Two-Factor Auth';
}

export class VerifyTwoFactorAuth {
  static readonly type = '[AccountSettings] Verify Two-Factor Auth';

  constructor(public code: string) {}
}

export class SetAccountSettings {
  static readonly type = '[AccountSettings] SetAccountSettings';

  constructor(public accountSettings: AccountSettings) {}
}

export class DeactivateAccount {
  static readonly type = '[AccountSettings] Deactivate Account';
}

export class CancelDeactivationRequest {
  static readonly type = '[AccountSettings] Cancel Deactivation Request';
}
