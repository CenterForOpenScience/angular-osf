import { Creator } from '@shared/entities/filters/creator/creator.entity';
import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/entities/filters/funder/funder-filter.entity';
import { InstitutionFilter } from '@shared/entities/filters/institution/institution-filter.entity';
import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { PartOfCollectionFilter } from '@shared/entities/filters/part-of-collection/part-of-collection-filter.entity';
import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ResourceTypeFilter } from '@shared/entities/filters/resource-type/resource-type.entity';
import { SubjectFilter } from '@shared/entities/filters/subject/subject-filter.entity';

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
