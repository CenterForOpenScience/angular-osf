import { AddonRequest } from '@osf/features/settings/addons/entities/addons.entities';

export class GetStorageAddons {
  static readonly type = '[Addons] Get Storage Addons';
}

export class GetCitationAddons {
  static readonly type = '[Addons] Get Citation Addons';
}

export class GetAuthorizedStorageAddons {
  static readonly type = '[Addons] Get Authorized Storage Addons';

  constructor(public referenceId: string) {}
}

export class GetAuthorizedCitationAddons {
  static readonly type = '[Addons] Get Authorized Citation Addons';

  constructor(public referenceId: string) {}
}

export class CreateAuthorizedAddon {
  static readonly type = '[Addons] Create Storage Addon';

  constructor(
    public payload: AddonRequest,
    public addonType: string
  ) {}
}

export class UpdateAuthorizedAddon {
  static readonly type = '[Addons] Update Storage Addon';

  constructor(
    public payload: AddonRequest,
    public addonType: string,
    public addonId: string
  ) {}
}

export class GetAddonsUserReference {
  static readonly type = '[Addons] Get Addons User Reference';
}

export class DeleteAuthorizedAddon {
  static readonly type = '[Addons] Delete Authorized Addon';

  constructor(
    public payload: string,
    public addonType: string
  ) {}
}
