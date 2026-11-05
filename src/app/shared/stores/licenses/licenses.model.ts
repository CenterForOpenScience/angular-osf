import { LicenseModel } from '@osf/shared/models/license/license.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface LicensesStateModel {
  licenses: AsyncStateModel<LicenseModel[]>;
  license: AsyncStateModel<LicenseModel | null>;
}

export const LICENSES_STATE_DEFAULTS: LicensesStateModel = {
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  license: {
    data: null,
    isLoading: false,
    error: null,
  },
};
