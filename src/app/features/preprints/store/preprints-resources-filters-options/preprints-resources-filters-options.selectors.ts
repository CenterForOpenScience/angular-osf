import { Selector } from '@ngxs/store';

import {
  Creator,
  DateCreated,
  InstitutionFilter,
  LicenseFilter,
  ProviderFilter,
  SubjectFilter,
} from '@osf/shared/models';

import { PreprintsResourceFiltersOptionsStateModel } from './preprints-resources-filters-options.model';
import { PreprintsResourcesFiltersOptionsState } from './preprints-resources-filters-options.state';

export class PreprintsResourcesFiltersOptionsSelectors {
  @Selector([PreprintsResourcesFiltersOptionsState])
  static isAnyFilterOptions(state: PreprintsResourceFiltersOptionsStateModel): boolean {
    return (
      state.datesCreated.length > 0 ||
      state.subjects.length > 0 ||
      state.licenses.length > 0 ||
      state.providers.length > 0
    );
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getCreators(state: PreprintsResourceFiltersOptionsStateModel): Creator[] {
    return state.creators;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getDatesCreated(state: PreprintsResourceFiltersOptionsStateModel): DateCreated[] {
    return state.datesCreated;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getSubjects(state: PreprintsResourceFiltersOptionsStateModel): SubjectFilter[] {
    return state.subjects;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getInstitutions(state: PreprintsResourceFiltersOptionsStateModel): InstitutionFilter[] {
    return state.institutions;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getLicenses(state: PreprintsResourceFiltersOptionsStateModel): LicenseFilter[] {
    return state.licenses;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getProviders(state: PreprintsResourceFiltersOptionsStateModel): ProviderFilter[] {
    return state.providers;
  }

  @Selector([PreprintsResourcesFiltersOptionsState])
  static getAllOptions(state: PreprintsResourceFiltersOptionsStateModel): PreprintsResourceFiltersOptionsStateModel {
    return {
      ...state,
    };
  }
}
