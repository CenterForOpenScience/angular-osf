import { ResourceFilterLabel } from '@shared/models';

export interface PreprintsResourcesFiltersStateModel {
  creator: ResourceFilterLabel;
  dateCreated: ResourceFilterLabel;
  subject: ResourceFilterLabel;
  license: ResourceFilterLabel;
  provider: ResourceFilterLabel;
  institution: ResourceFilterLabel;
}
