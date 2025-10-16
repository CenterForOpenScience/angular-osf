import { AsyncStateWithTotalCount, NodeModel } from '@osf/shared/models';

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
