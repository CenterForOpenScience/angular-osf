import { ResourceType } from '@osf/features/search/models/resource-type.enum';

export interface ResourceFiltersStateModel {
  creator: string;
  dateCreated: Date;
  funder: string;
  subject: string;
  license: string;
  resourceType: ResourceType;
  institution: string;
  provider: string;
  partOfCollection: string;
}
