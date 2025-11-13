import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { BaseNodeModel } from '@osf/shared/models/nodes/base-node.model';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { AsyncStateModel } from '@shared/models/store/async-state.model';

export interface CurrentResourceStateModel {
  currentResource: AsyncStateModel<CurrentResource | null>;
  resourceDetails: AsyncStateModel<BaseNodeModel>;
  resourceChildren: AsyncStateModel<NodeShortInfoModel[]>;
}

export const CURRENT_RESOURCE_DEFAULTS: CurrentResourceStateModel = {
  currentResource: {
    data: null,
    isLoading: false,
    error: null,
  },
  resourceDetails: {
    data: {} as BaseNodeModel,
    isLoading: false,
    error: null,
  },
  resourceChildren: {
    data: [],
    isLoading: false,
    error: null,
  },
};
