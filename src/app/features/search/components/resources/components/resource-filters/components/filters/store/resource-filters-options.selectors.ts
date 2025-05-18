import { Selector } from '@ngxs/store';

import { ResourceFiltersOptionsStateModel } from '@osf/features/search/components/resources/components/resource-filters/components/filters/store/resource-filters-options.model';
import { ResourceFiltersOptionsState } from '@osf/features/search/components/resources/components/resource-filters/components/filters/store/resource-filters-options.state';
import { Creator } from '@shared/entities/filters/creator/creator.entity';
import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/entities/filters/funder/funder-filter.entity';
import { InstitutionFilter } from '@shared/entities/filters/institution/institution-filter.entity';
import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { PartOfCollectionFilter } from '@shared/entities/filters/part-of-collection/part-of-collection-filter.entity';
import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ResourceTypeFilter } from '@shared/entities/filters/resource-type/resource-type.entity';
import { SubjectFilter } from '@shared/entities/filters/subject/subject-filter.entity';

export class ResourceFiltersOptionsSelectors {
  @Selector([ResourceFiltersOptionsState])
  static getCreators(state: ResourceFiltersOptionsStateModel): Creator[] {
    return state.creators;
  }

  @Selector([ResourceFiltersOptionsState])
  static getDatesCreated(state: ResourceFiltersOptionsStateModel): DateCreated[] {
    return state.datesCreated;
  }

  @Selector([ResourceFiltersOptionsState])
  static getFunders(state: ResourceFiltersOptionsStateModel): FunderFilter[] {
    return state.funders;
  }

  @Selector([ResourceFiltersOptionsState])
  static getSubjects(state: ResourceFiltersOptionsStateModel): SubjectFilter[] {
    return state.subjects;
  }

  @Selector([ResourceFiltersOptionsState])
  static getLicenses(state: ResourceFiltersOptionsStateModel): LicenseFilter[] {
    return state.licenses;
  }

  @Selector([ResourceFiltersOptionsState])
  static getResourceTypes(state: ResourceFiltersOptionsStateModel): ResourceTypeFilter[] {
    return state.resourceTypes;
  }

  @Selector([ResourceFiltersOptionsState])
  static getInstitutions(state: ResourceFiltersOptionsStateModel): InstitutionFilter[] {
    return state.institutions;
  }

  @Selector([ResourceFiltersOptionsState])
  static getProviders(state: ResourceFiltersOptionsStateModel): ProviderFilter[] {
    return state.providers;
  }

  @Selector([ResourceFiltersOptionsState])
  static getPartOfCollection(state: ResourceFiltersOptionsStateModel): PartOfCollectionFilter[] {
    return state.partOfCollection;
  }

  @Selector([ResourceFiltersOptionsState])
  static getAllOptions(state: ResourceFiltersOptionsStateModel): ResourceFiltersOptionsStateModel {
    return {
      ...state,
    };
  }
}
