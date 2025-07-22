import { Selector } from '@ngxs/store';

import { NodeLinksStateModel } from './node-links.model';
import { NodeLinksState } from './node-links.state';

export class NodeLinksSelectors {
  @Selector([NodeLinksState])
  static getNodeLinks(state: NodeLinksStateModel) {
    return state.nodeLinks.data;
  }

  @Selector([NodeLinksState])
  static getNodeLinksLoading(state: NodeLinksStateModel) {
    return state.nodeLinks.isLoading;
  }

  @Selector([NodeLinksState])
  static getNodeLinksSubmitting(state: NodeLinksStateModel) {
    return state.nodeLinks.isSubmitting || false;
  }

  @Selector([NodeLinksState])
  static getLinkedResources(state: NodeLinksStateModel) {
    return state.linkedResources.data;
  }

  @Selector([NodeLinksState])
  static getLinkedResourcesLoading(state: NodeLinksStateModel) {
    return state.linkedResources.isLoading;
  }

  @Selector([NodeLinksState])
  static getLinkedResourcesSubmitting(state: NodeLinksStateModel) {
    return state.linkedResources.isSubmitting;
  }
}
