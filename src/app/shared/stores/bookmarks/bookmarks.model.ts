import { AsyncStateModel } from '@shared/models/store';

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
