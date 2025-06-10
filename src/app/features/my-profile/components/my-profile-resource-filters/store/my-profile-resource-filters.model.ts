import { ResourceFilterLabel } from '@shared/models';

export interface MyProfileResourceFiltersStateModel {
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
