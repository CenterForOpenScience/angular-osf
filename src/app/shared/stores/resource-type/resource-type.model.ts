import { ResourceType } from '@shared/enums';
import { AsyncStateModel } from '@shared/models/store';

export interface ResourceTypeStateModel {
  currentResourceType: AsyncStateModel<ResourceType | null>;
  currentResourceId: string | null;
}

export const RESOURCE_TYPE_DEFAULTS: ResourceTypeStateModel = {
  currentResourceType: {
    data: null,
    isLoading: false,
    error: null,
  },
  currentResourceId: null,
};
