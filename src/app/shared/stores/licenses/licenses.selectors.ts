import { Selector } from '@ngxs/store';

import { LicenseModel } from '@osf/shared/models';

import { LicensesStateModel } from './licenses.model';
import { LicensesState } from './licenses.state';

export class LicensesSelectors {
  @Selector([LicensesState])
  static getLicenses(state: LicensesStateModel): LicenseModel[] {
    return state.licenses.data;
  }

  @Selector([LicensesState])
  static getLoading(state: LicensesStateModel): boolean {
    return state.licenses.isLoading;
  }

  @Selector([LicensesState])
  static getError(state: LicensesStateModel): string | null {
    return state.licenses.error;
  }
}
