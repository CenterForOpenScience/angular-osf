import { AsyncStateModel } from '@shared/models/store/async-state.model';

export interface BookmarksStateModel {
  bookmarksId: AsyncStateModel<string>;
}

export const BOOKMARKS_DEFAULTS: BookmarksStateModel = {
  bookmarksId: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
