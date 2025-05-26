import { Selector } from '@ngxs/store';

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

import { MyProfileResourceFiltersOptionsStateModel } from './my-profile-resource-filters-options.model';
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
