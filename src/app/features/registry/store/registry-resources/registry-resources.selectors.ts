import { Selector } from '@ngxs/store';

import { RegistryResource } from '../../models';

import { RegistryResourcesStateModel } from './registry-resources.model';
import { RegistryResourcesState } from './registry-resources.state';

export class RegistryResourcesSelectors {
  @Selector([RegistryResourcesState])
  static getResources(state: RegistryResourcesStateModel): RegistryResource[] | null {
    return state.resources.data;
  }

  @Selector([RegistryResourcesState])
  static isResourcesLoading(state: RegistryResourcesStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([RegistryResourcesState])
  static getCurrentResource(state: RegistryResourcesStateModel): RegistryResource | null {
    return state.currentResource.data;
  }

  @Selector([RegistryResourcesState])
  static isCurrentResourceLoading(state: RegistryResourcesStateModel): boolean {
    return !!state.currentResource.isLoading;
  }
}
