import { ComponentOverview } from '@osf/shared/models/components/components.models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

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
