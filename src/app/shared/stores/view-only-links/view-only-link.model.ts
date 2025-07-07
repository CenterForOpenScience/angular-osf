import { NodeData, PaginatedViewOnlyLinksModel } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface ViewOnlyLinkStateModel {
  viewOnlyLinks: AsyncStateModel<PaginatedViewOnlyLinksModel>;
  resourceDetails: AsyncStateModel<NodeData>;
}
