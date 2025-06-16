import { StringOrNull } from '@core/helpers';

export class SetSelectedPreprintProviderId {
  static readonly type = '[Submit Preprint] Set Selected Preprint Provider Id';

  constructor(public id: StringOrNull) {}
}
