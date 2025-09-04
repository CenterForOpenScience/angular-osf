import { AsyncStateModel, PaginatedViewOnlyLinksModel } from '@osf/shared/models';

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
