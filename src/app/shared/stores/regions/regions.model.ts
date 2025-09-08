import { AsyncStateModel, IdName } from '@shared/models';

export interface RegionsStateModel {
  regions: AsyncStateModel<IdName[]>;
}

export const REGIONS_STATE_DEFAULTS = {
  regions: {
    data: [],
    isLoading: false,
    error: null,
  },
};
