import { LinkItem } from '@osf/features/search/models/link-item.model';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';

export interface Resource {
  id: string;
  resourceType: ResourceType;
  dateCreated?: Date;
  dateModified?: Date;
  creators?: LinkItem[];
  fileName?: string;
  title?: string;
  description?: string;
  from?: LinkItem;
  license?: LinkItem;
  provider?: LinkItem;
  registrationTemplate?: string;
  doi?: string;
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
