import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface NodeLinksStateModel {
  linkedResources: AsyncStateModel<NodeModel[]>;
}

export const NODE_LINKS_DEFAULTS: NodeLinksStateModel = {
  linkedResources: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
