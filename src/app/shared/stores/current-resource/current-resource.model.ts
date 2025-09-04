import { BaseNodeModel, CurrentResource, NodeShortInfoModel } from '@osf/shared/models';
import { AsyncStateModel } from '@shared/models/store';

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
