import { AsyncStateModel, NodeData, PaginatedViewOnlyLinksModel } from '@osf/shared/models';

export interface ViewOnlyLinkStateModel {
  viewOnlyLinks: AsyncStateModel<PaginatedViewOnlyLinksModel>;
  resourceDetails: AsyncStateModel<NodeData>;
}
