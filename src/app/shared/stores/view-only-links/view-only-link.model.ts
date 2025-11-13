import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { PaginatedViewOnlyLinksModel } from '@osf/shared/models/view-only-links/view-only-link.model';

export interface ViewOnlyLinkStateModel {
  viewOnlyLinks: AsyncStateModel<PaginatedViewOnlyLinksModel>;
}

export const VIEW_ONLY_LINK_STATE_DEFAULTS: ViewOnlyLinkStateModel = {
  viewOnlyLinks: {
    data: {} as PaginatedViewOnlyLinksModel,
    isLoading: false,
    error: null,
  },
};
