import { AsyncStateModel, ComponentOverview } from '@osf/shared/models';

export interface NodeLinksStateModel {
  linkedResources: AsyncStateModel<ComponentOverview[]>;
}

export const NODE_LINKS_DEFAULTS: NodeLinksStateModel = {
  linkedResources: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
