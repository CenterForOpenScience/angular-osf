import { ResourceType } from '@osf/features/search/models/resource-type.enum';
import { LinkItem } from '@osf/features/search/models/link-item.entity';

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
  license?: string;
  publisher?: LinkItem;
  registrationTemplate?: string;
  doi?: string;
  provider?: LinkItem;
  conflictOfInterestResponse?: string;
  publicProjects?: number;
  publicRegistrations?: number;
  publicPreprints?: number;
  orcid?: string;
}
