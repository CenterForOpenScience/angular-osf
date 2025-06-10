import { ResourceFilterLabel } from '@osf/shared/models';

export interface ResourceFiltersStateModel {
  creator: ResourceFilterLabel;
  dateCreated: ResourceFilterLabel;
  funder: ResourceFilterLabel;
  subject: ResourceFilterLabel;
  license: ResourceFilterLabel;
  resourceType: ResourceFilterLabel;
  institution: ResourceFilterLabel;
  provider: ResourceFilterLabel;
  partOfCollection: ResourceFilterLabel;
}
