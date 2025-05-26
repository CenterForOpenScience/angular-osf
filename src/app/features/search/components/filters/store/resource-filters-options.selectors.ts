import { Selector } from '@ngxs/store';

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

import { ResourceFiltersOptionsStateModel } from './resource-filters-options.model';
import { ResourceFiltersOptionsState } from './resource-filters-options.state';

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
