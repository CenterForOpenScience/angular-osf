import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

export interface ParentProjectModel extends NodeModel {
  contributors: ContributorModel[];
}
