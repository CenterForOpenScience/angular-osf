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

import { ProfileResourceFiltersOptionsStateModel } from './profile-resource-filters-options.model';
import { ProfileResourceFiltersOptionsState } from './profile-resource-filters-options.state';

export class ProfileResourceFiltersOptionsSelectors {
  @Selector([ProfileResourceFiltersOptionsState])
  static getDatesCreated(state: ProfileResourceFiltersOptionsStateModel): DateCreated[] {
    return state.datesCreated;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getFunders(state: ProfileResourceFiltersOptionsStateModel): FunderFilter[] {
    return state.funders;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getSubjects(state: ProfileResourceFiltersOptionsStateModel): SubjectFilter[] {
    return state.subjects;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getLicenses(state: ProfileResourceFiltersOptionsStateModel): LicenseFilter[] {
    return state.licenses;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getResourceTypes(state: ProfileResourceFiltersOptionsStateModel): ResourceTypeFilter[] {
    return state.resourceTypes;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getInstitutions(state: ProfileResourceFiltersOptionsStateModel): InstitutionFilter[] {
    return state.institutions;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getProviders(state: ProfileResourceFiltersOptionsStateModel): ProviderFilter[] {
    return state.providers;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getPartOfCollection(state: ProfileResourceFiltersOptionsStateModel): PartOfCollectionFilter[] {
    return state.partOfCollection;
  }

  @Selector([ProfileResourceFiltersOptionsState])
  static getAllOptions(state: ProfileResourceFiltersOptionsStateModel): ProfileResourceFiltersOptionsStateModel {
    return {
      ...state,
    };
  }
}
