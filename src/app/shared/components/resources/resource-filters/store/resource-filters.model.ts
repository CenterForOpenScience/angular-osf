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

export interface ResourceFilterLabel {
  filterName: string;
  label?: string;
  value?: string;
}
