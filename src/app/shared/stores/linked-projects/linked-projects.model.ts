import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

export interface LinkedProjectsStateModel {
  linkedProjects: AsyncStateWithTotalCount<NodeModel[]>;
}

export const LINKED_PROJECTS_DEFAULTS: LinkedProjectsStateModel = {
  linkedProjects: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    totalCount: 0,
  },
};
