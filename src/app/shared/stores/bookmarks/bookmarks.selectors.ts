import { Selector } from '@ngxs/store';

import { BookmarksStateModel } from './bookmarks.model';
import { BookmarksState } from './bookmarks.state';

export class BookmarksSelectors {
  @Selector([BookmarksState])
  static getBookmarksCollectionId(state: BookmarksStateModel) {
    return state.bookmarkCollectionId.data;
  }

  @Selector([BookmarksState])
  static getBookmarksCollectionIdLoading(state: BookmarksStateModel) {
    return state.bookmarkCollectionId.isLoading;
  }

  @Selector([BookmarksState])
  static getBookmarksCollectionIdSubmitting(state: BookmarksStateModel) {
    return state.bookmarkCollectionId.isSubmitting;
  }

  @Selector([BookmarksState])
  static getBookmarks(state: BookmarksStateModel) {
    return state.items.data;
  }

  @Selector([BookmarksState])
  static areBookmarksLoading(state: BookmarksStateModel) {
    return state.items.isLoading;
  }

  @Selector([BookmarksState])
  static getBookmarksTotalCount(state: BookmarksStateModel) {
    return state.items.totalCount;
  }
}
