import { Selector } from '@ngxs/store';

import { InstitutionsStateModel } from './institutions.model';
import { InstitutionsState } from './institutions.state';

export class InstitutionsSelectors {
  @Selector([InstitutionsState])
  static getUserInstitutions(state: InstitutionsStateModel) {
    return state.userInstitutions;
  }

  @Selector([InstitutionsState])
  static getInstitutions(state: InstitutionsStateModel) {
    return state.institutions.data;
  }

  @Selector([InstitutionsState])
  static isInstitutionsLoading(state: InstitutionsStateModel): boolean {
    return state.institutions.isLoading;
  }

  @Selector([InstitutionsState])
  static getInstitutionsTotalCount(state: InstitutionsStateModel): number {
    return state.institutions.totalCount;
  }
}
