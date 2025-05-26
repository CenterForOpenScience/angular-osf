import {
  DateCreated,
  FunderFilter,
  InstitutionFilter,
  LicenseFilter,
  PartOfCollectionFilter,
  ProviderFilter,
  ResourceTypeFilter,
  SubjectFilter,
} from '@osf/shared/models';

export interface MyProfileResourceFiltersOptionsStateModel {
  datesCreated: DateCreated[];
  funders: FunderFilter[];
  subjects: SubjectFilter[];
  licenses: LicenseFilter[];
  resourceTypes: ResourceTypeFilter[];
  institutions: InstitutionFilter[];
  providers: ProviderFilter[];
  partOfCollection: PartOfCollectionFilter[];
}
