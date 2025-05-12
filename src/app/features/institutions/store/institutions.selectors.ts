import { Selector } from '@ngxs/store';

import { InstitutionsStateModel } from './institutions.model';
import { InstitutionsState } from './institutions.state';

export class InstitutionsSelectors {
  @Selector([InstitutionsState])
  static getUserInstitutions(state: InstitutionsStateModel) {
    return state.userInstitutions;
  }
}
