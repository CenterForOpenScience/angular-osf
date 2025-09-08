import { ResourceType } from '@osf/shared/enums';

import { DiscoverableFilter } from './discaverable-filter.model';

export interface ResourceModel {
  absoluteUrl: string;
  resourceType: ResourceType;
  name?: string;
  title?: string;
  fileName?: string;
  description?: string;

  dateCreated?: Date;
  dateModified?: Date;
  dateWithdrawn?: Date;

  doi: string[];
  creators: AbsoluteUrlName[];
  identifiers: string[];
  provider?: AbsoluteUrlName;
  license?: AbsoluteUrlName;
  language: string;
  statedConflictOfInterest?: string;
  resourceNature?: string;
  isPartOfCollection: AbsoluteUrlName;
  funders: AbsoluteUrlName[];
  affiliations: AbsoluteUrlName[];
  qualifiedAttribution: QualifiedAttribution[];
  isPartOf?: AbsoluteUrlName;
  isContainedBy?: IsContainedBy;
  registrationTemplate?: string;
  hasPreregisteredAnalysisPlan?: string;
  hasPreregisteredStudyDesign?: string;
  hasDataResource: string;
  hasAnalyticCodeResource: boolean;
  hasMaterialsResource: boolean;
  hasPapersResource: boolean;
  hasSupplementalResource: boolean;
}

export interface IsContainedBy extends AbsoluteUrlName {
  funders: AbsoluteUrlName[];
  creators: AbsoluteUrlName[];
  license?: AbsoluteUrlName;
  qualifiedAttribution: QualifiedAttribution[];
}

export interface QualifiedAttribution {
  agentId: string;
  order: number;
}

export interface AbsoluteUrlName {
  absoluteUrl: string;
  name: string;
}

export interface ResourcesData {
  resources: ResourceModel[];
  filters: DiscoverableFilter[];
  count: number;
  first: string;
  next: string;
  previous?: string;
}
