import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface LinkedResourcesState extends AsyncStateModel<NodeModel[]> {
  page: number;
  pageSize: number;
  projectsTotalCount: number;
  registrationsTotalCount: number;
  isLoadingMore: boolean;
  hasChanges: boolean;
}

export interface NodeLinksStateModel {
  linkedResources: LinkedResourcesState;
}

export const NODE_LINKS_DEFAULTS: NodeLinksStateModel = {
  linkedResources: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    page: 1,
    pageSize: DEFAULT_TABLE_PARAMS.rows,
    projectsTotalCount: 0,
    registrationsTotalCount: 0,
    isLoadingMore: false,
    hasChanges: false,
  },
};
