import {
  AuthorizedAddonRequestJsonApi,
  ConfiguredAddonRequestJsonApi,
  OperationInvocationRequestJsonApi,
} from '@shared/models';

export class GetStorageAddons {
  static readonly type = '[Addons] Get Storage Addons';
}

export class GetCitationAddons {
  static readonly type = '[Addons] Get Citation Addons';
}

export class GetLinkAddons {
  static readonly type = '[Addons] Get Link Addons';
}

export class GetAuthorizedStorageAddons {
  static readonly type = '[Addons] Get Authorized Storage Addons';

  constructor(public referenceId: string) {}
}

export class GetAuthorizedStorageOauthToken {
  static readonly type = '[Addons] Get Authorized Storage Oauth Token';

  constructor(public accountId: string) {}
}

export class GetAuthorizedCitationAddons {
  static readonly type = '[Addons] Get Authorized Citation Addons';

  constructor(public referenceId: string) {}
}

export class GetAuthorizedLinkAddons {
  static readonly type = '[Addons] Get Authorized Link Addons';

  constructor(public referenceId: string) {}
}

export class GetConfiguredStorageAddons {
  static readonly type = '[Addons] Get Configured Storage Addons';

  constructor(public referenceId: string) {}
}

export class GetConfiguredCitationAddons {
  static readonly type = '[Addons] Get Configured Citation Addons';

  constructor(public referenceId: string) {}
}

export class GetConfiguredLinkAddons {
  static readonly type = '[Addons] Get Configured Link Addons';

  constructor(public referenceId: string) {}
}

export class CreateAuthorizedAddon {
  static readonly type = '[Addons] Create Authorized Addon';

  constructor(
    public payload: AuthorizedAddonRequestJsonApi,
    public addonType: string
  ) {}
}

export class UpdateAuthorizedAddon {
  static readonly type = '[Addons] Update Authorized Addon';

  constructor(
    public payload: AuthorizedAddonRequestJsonApi,
    public addonType: string,
    public addonId: string
  ) {}
}

export class CreateConfiguredAddon {
  static readonly type = '[Addons] Create Configured Addon';

  constructor(
    public payload: ConfiguredAddonRequestJsonApi,
    public addonType: string
  ) {}
}

export class UpdateConfiguredAddon {
  static readonly type = '[Addons] Update Configured Addon';

  constructor(
    public payload: ConfiguredAddonRequestJsonApi,
    public addonType: string,
    public addonId: string
  ) {}
}

export class GetAddonsUserReference {
  static readonly type = '[Addons] Get Addons User Reference';
}

export class GetAddonsResourceReference {
  static readonly type = '[Addons] Get Addons Resource Reference';

  constructor(public resourceId: string) {}
}

export class DeleteAuthorizedAddon {
  static readonly type = '[Addons] Delete Authorized Addon';

  constructor(
    public id: string,
    public addonType: string
  ) {}
}

export class DeleteConfiguredAddon {
  static readonly type = '[Addons] Delete Configured Addon';

  constructor(
    public id: string,
    public addonType: string
  ) {}
}

export class CreateAddonOperationInvocation {
  static readonly type = '[Addons] Create Addon Operation Invocation';

  constructor(public payload: OperationInvocationRequestJsonApi) {}
}

export class ClearConfiguredAddons {
  static readonly type = '[Addons] Clear Configured Addons';
}

export class ClearOperationInvocations {
  static readonly type = '[Addons] Clear Operation Invocations';
}
