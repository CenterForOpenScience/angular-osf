import { Creator, DateCreated, LicenseFilter, ProviderFilter, SubjectFilter } from '@osf/shared/models';

export interface PreprintsResourceFiltersOptionsStateModel {
  creators: Creator[];
  datesCreated: DateCreated[];
  subjects: SubjectFilter[];
  licenses: LicenseFilter[];
  providers: ProviderFilter[];
}
