import { Selector } from '@ngxs/store';

import { InstitutionsSearchModel } from './institutions-search.model';
import { InstitutionsSearchState } from './institutions-search.state';

export class InstitutionsSearchSelectors {
  @Selector([InstitutionsSearchState])
  static getInstitution(state: InstitutionsSearchModel) {
    return state.institution.data;
  }

  @Selector([InstitutionsSearchState])
  static getInstitutionLoading(state: InstitutionsSearchModel) {
    return state.institution.isLoading;
  }
}
