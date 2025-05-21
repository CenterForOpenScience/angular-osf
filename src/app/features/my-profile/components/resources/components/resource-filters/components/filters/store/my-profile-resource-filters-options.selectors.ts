import { Selector } from '@ngxs/store';

import { MyProfileResourceFiltersOptionsStateModel } from '@osf/features/my-profile/components/resources/components/resource-filters/components/filters/store/my-profile-resource-filters-options.model';
import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { FunderFilter } from '@shared/entities/filters/funder/funder-filter.entity';
import { InstitutionFilter } from '@shared/entities/filters/institution/institution-filter.entity';
import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { PartOfCollectionFilter } from '@shared/entities/filters/part-of-collection/part-of-collection-filter.entity';
import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ResourceTypeFilter } from '@shared/entities/filters/resource-type/resource-type.entity';
import { SubjectFilter } from '@shared/entities/filters/subject/subject-filter.entity';

import { MyProfileResourceFiltersOptionsState } from './my-profile-resource-filters-options.state';

export class MyProfileResourceFiltersOptionsSelectors {
  @Selector([MyProfileResourceFiltersOptionsState])
  static getDatesCreated(state: MyProfileResourceFiltersOptionsStateModel): DateCreated[] {
    return state.datesCreated;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getFunders(state: MyProfileResourceFiltersOptionsStateModel): FunderFilter[] {
    return state.funders;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getSubjects(state: MyProfileResourceFiltersOptionsStateModel): SubjectFilter[] {
    return state.subjects;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getLicenses(state: MyProfileResourceFiltersOptionsStateModel): LicenseFilter[] {
    return state.licenses;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getResourceTypes(state: MyProfileResourceFiltersOptionsStateModel): ResourceTypeFilter[] {
    return state.resourceTypes;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getInstitutions(state: MyProfileResourceFiltersOptionsStateModel): InstitutionFilter[] {
    return state.institutions;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getProviders(state: MyProfileResourceFiltersOptionsStateModel): ProviderFilter[] {
    return state.providers;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getPartOfCollection(state: MyProfileResourceFiltersOptionsStateModel): PartOfCollectionFilter[] {
    return state.partOfCollection;
  }

  @Selector([MyProfileResourceFiltersOptionsState])
  static getAllOptions(state: MyProfileResourceFiltersOptionsStateModel): MyProfileResourceFiltersOptionsStateModel {
    return {
      ...state,
    };
  }
}
