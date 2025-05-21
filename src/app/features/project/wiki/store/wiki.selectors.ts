import { Selector } from '@ngxs/store';

import { WikiStateModel } from '@osf/features/project/wiki/store/wiki.model';

import { WikiState } from './wiki.state';

export class WikiSelectors {
  @Selector([WikiState])
  static getHomeWikiContent(state: WikiStateModel): string {
    return state.homeWikiContent.data;
  }

  @Selector([WikiState])
  static getHomeWikiLoading(state: WikiStateModel): boolean {
    return state.homeWikiContent.isLoading;
  }
}
