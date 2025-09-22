import { Selector } from '@ngxs/store';

import { RegistryLinksStateModel } from './registry-links.model';
import { RegistryLinksState } from './registry-links.state';

export class RegistryLinksSelectors {
  @Selector([RegistryLinksState])
  static getLinkedNodes(state: RegistryLinksStateModel) {
    return state.linkedNodes.data;
  }

  @Selector([RegistryLinksState])
  static getLinkedNodesLoading(state: RegistryLinksStateModel) {
    return state.linkedNodes.isLoading;
  }

  @Selector([RegistryLinksState])
  static getLinkedRegistrations(state: RegistryLinksStateModel) {
    return state.linkedRegistrations.data;
  }

  @Selector([RegistryLinksState])
  static getLinkedRegistrationsLoading(state: RegistryLinksStateModel) {
    return state.linkedRegistrations.isLoading;
  }
}
