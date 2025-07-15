import { Selector } from '@ngxs/store';

import { CitationsStateModel } from './citations.model';
import { CitationsState } from './citations.state';

export class CitationsSelectors {
  @Selector([CitationsState])
  static getDefaultCitations(state: CitationsStateModel) {
    return state.defaultCitations.data;
  }

  @Selector([CitationsState])
  static getDefaultCitationsLoading(state: CitationsStateModel) {
    return state.defaultCitations.isLoading;
  }
}
