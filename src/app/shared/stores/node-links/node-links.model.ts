import { AsyncStateModel, ComponentOverview } from '@osf/shared/models';
import { NodeLink } from '@shared/models/node-links';

export interface NodeLinksStateModel {
  nodeLinks: AsyncStateModel<NodeLink[]>;
  linkedResources: AsyncStateModel<ComponentOverview[]>;
}
