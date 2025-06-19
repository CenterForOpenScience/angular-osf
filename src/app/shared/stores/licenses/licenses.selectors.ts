import { Selector } from '@ngxs/store';

import { License, LicensesStateModel } from '@shared/models';
import { LicensesState } from '@shared/stores';

export class LicensesSelectors {
  @Selector([LicensesState])
  static getLicenses(state: LicensesStateModel): License[] {
    return state.licenses;
  }
}
