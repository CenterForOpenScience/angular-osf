import { AsyncStateModel, LicenseModel } from '@osf/shared/models';

export interface LicensesStateModel {
  licenses: AsyncStateModel<LicenseModel[]>;
}

export const LICENSES_STATE_DEFAULTS: LicensesStateModel = {
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
};
