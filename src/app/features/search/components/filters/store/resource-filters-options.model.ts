import {
  Creator,
  DateCreated,
  FunderFilter,
  InstitutionFilter,
  LicenseFilter,
  PartOfCollectionFilter,
  ProviderFilter,
  ResourceTypeFilter,
  SubjectFilter,
} from '@osf/shared/models';

export interface ResourceFiltersOptionsStateModel {
  creators: Creator[];
  datesCreated: DateCreated[];
  funders: FunderFilter[];
  subjects: SubjectFilter[];
  licenses: LicenseFilter[];
  resourceTypes: ResourceTypeFilter[];
  institutions: InstitutionFilter[];
  providers: ProviderFilter[];
  partOfCollection: PartOfCollectionFilter[];
}
