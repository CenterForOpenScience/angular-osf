import { DeveloperAppCreateUpdate } from '@osf/features/settings/developer-apps/entities/developer-apps.models';

export class GetDeveloperApps {
  static readonly type = '[Developer Apps] Get All';
}

export class GetDeveloperAppDetails {
  static readonly type = '[Developer Apps] Get Details';

  constructor(public clientId: string) {}
}

export class CreateDeveloperApp {
  static readonly type = '[Developer Apps] Create';

  constructor(public developerAppCreate: DeveloperAppCreateUpdate) {}
}

export class ResetClientSecret {
  static readonly type = '[Developer Apps] Reset Client Secret';

  constructor(public clientId: string) {}
}

export class UpdateDeveloperApp {
  static readonly type = '[Developer Apps]  Update';

  constructor(
    public clientId: string,
    public developerAppUpdate: DeveloperAppCreateUpdate,
  ) {}
}

export class DeleteDeveloperApp {
  static readonly type = '[Developer Apps] Delete';

  constructor(public clientId: string) {}
}
