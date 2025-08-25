import { Selector } from '@ngxs/store';

import { ResourceFilterLabel } from '@shared/models';

import { ProfileResourceFiltersStateModel } from './profile-resource-filters.model';
import { ProfileResourceFiltersState } from './profile-resource-filters.state';

export class ProfileResourceFiltersSelectors {
  @Selector([ProfileResourceFiltersState])
  static getAllFilters(state: ProfileResourceFiltersStateModel): ProfileResourceFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([ProfileResourceFiltersState])
  static getCreator(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([ProfileResourceFiltersState])
  static getDateCreated(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([ProfileResourceFiltersState])
  static getFunder(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.funder;
  }

  @Selector([ProfileResourceFiltersState])
  static getSubject(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([ProfileResourceFiltersState])
  static getLicense(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([ProfileResourceFiltersState])
  static getResourceType(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.resourceType;
  }

  @Selector([ProfileResourceFiltersState])
  static getInstitution(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([ProfileResourceFiltersState])
  static getProvider(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }

  @Selector([ProfileResourceFiltersState])
  static getPartOfCollection(state: ProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.partOfCollection;
  }
}
