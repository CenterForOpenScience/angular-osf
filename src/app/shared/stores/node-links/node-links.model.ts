import { AsyncStateModel, ComponentOverview } from '@osf/shared/models';
import { NodeLink } from '@shared/models/node-links';

export interface NodeLinksStateModel {
  nodeLinks: AsyncStateModel<NodeLink[]>;
  linkedResources: AsyncStateModel<ComponentOverview[]>;
}

export const NODE_LINKS_DEFAULTS: NodeLinksStateModel = {
  nodeLinks: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  linkedResources: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
