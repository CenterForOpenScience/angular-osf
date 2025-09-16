import { Selector } from '@ngxs/store';

import { ProviderShortInfoModel } from '@osf/shared/models';

import { ProviderStateModel } from './provider.model';
import { ProviderState } from './provider.state';

export class ProviderSelectors {
  @Selector([ProviderState])
  static getCurrentProvider(state: ProviderStateModel): ProviderShortInfoModel | null {
    return state.currentProvider;
  }
}
