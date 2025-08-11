import { ProviderModel } from '@osf/shared/models';

export class SetCurrentProvider {
  static readonly type = '[Provider] Set Current Provider';
  constructor(public provider: ProviderModel) {}
}
