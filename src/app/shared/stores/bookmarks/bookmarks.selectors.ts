import { Selector } from '@ngxs/store';

import { BookmarksStateModel } from './bookmarks.model';
import { BookmarksState } from './bookmarks.state';

export class BookmarksSelectors {
  @Selector([BookmarksState])
  static getBookmarksCollectionId(state: BookmarksStateModel) {
    return state.bookmarksId.data;
  }

  @Selector([BookmarksState])
  static getBookmarksCollectionIdLoading(state: BookmarksStateModel) {
    return state.bookmarksId.isLoading;
  }

  @Selector([BookmarksState])
  static getBookmarksCollectionIdSubmitting(state: BookmarksStateModel) {
    return state.bookmarksId.isSubmitting;
  }

  @Selector([BookmarksState])
  static getBookmarksError(state: BookmarksStateModel) {
    return state.bookmarksId.error;
  }
}
