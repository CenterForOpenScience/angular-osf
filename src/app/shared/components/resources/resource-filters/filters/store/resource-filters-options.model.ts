import { Creator } from '@shared/components/resources/resource-filters/models/creator/creator.entity';
import { DateCreated } from '@shared/components/resources/resource-filters/models/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/components/resources/resource-filters/models/funder/funder-filter.entity';
import { SubjectFilter } from '@shared/components/resources/resource-filters/models/subject/subject-filter.entity';
import { LicenseFilter } from '@shared/components/resources/resource-filters/models/license/license-filter.entity';
import { ResourceTypeFilter } from '@shared/components/resources/resource-filters/models/resource-type/resource-type.entity';
import { ProviderFilter } from '@shared/components/resources/resource-filters/models/provider/provider-filter.entity';
import { PartOfCollectionFilter } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-filter.entity';
import { InstitutionFilter } from '@shared/components/resources/resource-filters/models/institution/institution-filter.entity';

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
