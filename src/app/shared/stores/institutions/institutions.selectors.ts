import { Selector } from '@ngxs/store';

import { InstitutionsStateModel } from './institutions.model';
import { InstitutionsState } from './institutions.state';

export class InstitutionsSelectors {
  @Selector([InstitutionsState])
  static getUserInstitutions(state: InstitutionsStateModel) {
    return state.userInstitutions.data;
  }

  @Selector([InstitutionsState])
  static areUserInstitutionsLoading(state: InstitutionsStateModel) {
    return state.userInstitutions.isLoading;
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

  @Selector([InstitutionsState])
  static getResourceInstitutions(state: InstitutionsStateModel) {
    return state.resourceInstitutions.data;
  }

  @Selector([InstitutionsState])
  static areResourceInstitutionsLoading(state: InstitutionsStateModel) {
    return state.resourceInstitutions.isLoading;
  }

  @Selector([InstitutionsState])
  static areResourceInstitutionsSubmitting(state: InstitutionsStateModel) {
    return state.resourceInstitutions.isSubmitting;
  }
}
