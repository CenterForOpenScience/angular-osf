import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { StringOrNull } from '@osf/shared/helpers/types.helper';

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
  creators: Creator[];
  identifiers: string[];
  provider?: AbsoluteUrlName;
  license?: AbsoluteUrlName;
  language: string;
  statedConflictOfInterest?: string;
  storageByteCount?: string;
  storageRegion?: string;
  viewsCount?: string;
  addons: string[];
  downloadCount?: string;
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
  context: StringOrNull;
}

export interface IsContainedBy extends AbsoluteUrlName {
  funders: AbsoluteUrlName[];
  creators: Creator[];
  license?: AbsoluteUrlName;
  qualifiedAttribution: QualifiedAttribution[];
}

export interface QualifiedAttribution {
  agentId: string;
  order: number;
  hadRole: string;
}

export interface Creator extends AbsoluteUrlName {
  affiliationsAbsoluteUrl: string[];
}

export interface AbsoluteUrlName {
  absoluteUrl: string;
  name: string;
}

export interface ResourcesData {
  resources: ResourceModel[];
  filters: DiscoverableFilter[];
  count: number;
  self: string;
  first: StringOrNull;
  next: StringOrNull;
  previous: StringOrNull;
}
