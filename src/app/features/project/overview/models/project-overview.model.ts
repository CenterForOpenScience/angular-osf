import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { BaseNodeModel } from '@osf/shared/models/nodes/base-node.model';

export interface ProjectOverviewWithMeta {
  project: ProjectOverviewModel;
  meta?: MetaJsonApi;
}

export interface ProjectOverviewModel extends BaseNodeModel {
  forksCount: number;
  viewOnlyLinksCount: number;
  parentId?: string;
  rootParentId?: string;
  licenseId?: string;
  contributors?: ContributorModel[];
  links: ProjectOverviewLinksModel;
}

interface ProjectOverviewLinksModel {
  iri: string;
}
