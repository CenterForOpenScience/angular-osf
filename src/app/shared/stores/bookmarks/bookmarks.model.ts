import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources.models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

export interface BookmarksStateModel {
  bookmarkCollectionId: AsyncStateModel<string>;
  items: AsyncStateWithTotalCount<MyResourcesItem[]>;
}

export const BOOKMARKS_DEFAULTS: BookmarksStateModel = {
  bookmarkCollectionId: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  items: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    totalCount: 0,
  },
};
