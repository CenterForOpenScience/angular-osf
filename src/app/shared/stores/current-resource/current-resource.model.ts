import { CurrentResource } from '@osf/shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface CurrentResourceStateModel {
  currentResource: AsyncStateModel<CurrentResource | null>;
}

export const CURRENT_RESOURCE_DEFAULTS: CurrentResourceStateModel = {
  currentResource: {
    data: null,
    isLoading: false,
    error: null,
  },
};
