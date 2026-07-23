import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { BaseNodeModel } from '@osf/shared/models/nodes/base-node.model';

export interface ProjectOverviewModel extends BaseNodeModel {
  forksCount: number;
  viewOnlyLinksCount: number;
  parentId?: string;
  rootParentId?: string;
  licenseId?: string;
  contributors?: ContributorModel[];
}
