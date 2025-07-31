import { Selector } from '@ngxs/store';

import { RegistryComponentsStateModel } from './registry-components.model';
import { RegistryComponentsState } from './registry-components.state';

export class RegistryComponentsSelectors {
  @Selector([RegistryComponentsState])
  static getRegistryComponents(state: RegistryComponentsStateModel) {
    return state.registryComponents.data;
  }

  @Selector([RegistryComponentsState])
  static getRegistryComponentsLoading(state: RegistryComponentsStateModel) {
    return state.registryComponents.isLoading;
  }
}
