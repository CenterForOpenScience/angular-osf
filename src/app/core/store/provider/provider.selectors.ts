import { Selector } from '@ngxs/store';

import { ProviderModel } from '@osf/shared/models';

import { ProviderStateModel } from './provider.model';
import { ProviderState } from './provider.state';

export class ProviderSelectors {
  @Selector([ProviderState])
  static getCurrentProvider(state: ProviderStateModel): ProviderModel | null {
    return state.currentProvider;
  }
}
