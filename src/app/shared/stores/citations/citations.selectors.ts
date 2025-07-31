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

  @Selector([CitationsState])
  static getDefaultCitationsSubmitting(state: CitationsStateModel) {
    return state.defaultCitations.isSubmitting;
  }

  @Selector([CitationsState])
  static getCustomCitationSubmitting(state: CitationsStateModel) {
    return state.customCitation.isSubmitting;
  }

  @Selector([CitationsState])
  static getCitationStyles(state: CitationsStateModel) {
    return state.citationStyles.data;
  }

  @Selector([CitationsState])
  static getCitationStylesLoading(state: CitationsStateModel) {
    return state.citationStyles.isLoading;
  }

  @Selector([CitationsState])
  static getStyledCitation(state: CitationsStateModel) {
    return state.styledCitation.data;
  }

  @Selector([CitationsState])
  static getStyledCitationLoading(state: CitationsStateModel) {
    return state.styledCitation.isLoading;
  }
}
