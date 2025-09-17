import { ProviderShortInfoModel } from '@osf/shared/models';

export class SetCurrentProvider {
  static readonly type = '[Provider] Set Current Provider';
  constructor(public provider: ProviderShortInfoModel) {}
}

export class ClearCurrentProvider {
  static readonly type = '[Provider] Clear Current Provider';
}
