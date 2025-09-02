import { ResourceType } from '@shared/enums';
import { DiscoverableFilter, IdName } from '@shared/models';

export interface Resource {
  id: string;
  resourceType: ResourceType;
  dateCreated?: Date;
  dateModified?: Date;
  creators?: IdName[];
  fileName?: string;
  title?: string;
  description?: string;
  from?: IdName;
  license?: IdName;
  provider?: IdName;
  registrationTemplate?: string;
  identifier?: string;
  conflictOfInterestResponse?: string;
  publicProjects?: number;
  publicRegistrations?: number;
  publicPreprints?: number;
  orcid?: string;
  employment?: string;
  education?: string;
  hasDataResource: boolean;
  hasAnalyticCodeResource: boolean;
  hasMaterialsResource: boolean;
  hasPapersResource: boolean;
  hasSupplementalResource: boolean;
}

export interface ResourcesData {
  resources: Resource[];
  filters: DiscoverableFilter[];
  count: number;
  first: string;
  next: string;
  previous: string;
}
