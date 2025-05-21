import { Selector } from '@ngxs/store';

import { CollectionsStateModel } from './collections.model';
import { CollectionsState } from './collections.state';

export class CollectionsSelectors {
  @Selector([CollectionsState])
  static getBookmarksCollectionId(state: CollectionsStateModel) {
    return state.bookmarksId.data;
  }

  @Selector([CollectionsState])
  static getBookmarksCollectionIdLoading(state: CollectionsStateModel) {
    return state.bookmarksId.isLoading;
  }

  @Selector([CollectionsState])
  static getBookmarksCollectionIdSubmitting(state: CollectionsStateModel) {
    return state.bookmarksId.isSubmitting;
  }
}
