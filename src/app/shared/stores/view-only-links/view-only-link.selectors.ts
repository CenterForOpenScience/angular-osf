import { Selector } from '@ngxs/store';

import { ViewOnlyLinkStateModel } from './view-only-link.model';
import { ViewOnlyLinkState } from './view-only-link.state';

export class ViewOnlyLinkSelectors {
  @Selector([ViewOnlyLinkState])
  static getViewOnlyLinks(state: ViewOnlyLinkStateModel) {
    return state.viewOnlyLinks.data;
  }

  @Selector([ViewOnlyLinkState])
  static isViewOnlyLinksLoading(state: ViewOnlyLinkStateModel) {
    return state.viewOnlyLinks.isLoading;
  }
}
