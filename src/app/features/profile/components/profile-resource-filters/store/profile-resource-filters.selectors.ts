import { Selector } from '@ngxs/store';

import { ResourceFiltersStateModel } from '@osf/features/search/components/resource-filters/store';
import { ResourceFilterLabel } from '@shared/models';

import { ProfileResourceFiltersState } from './profile-resource-filters.state';

export class ProfileResourceFiltersSelectors {
  @Selector([ProfileResourceFiltersState])
  static getAllFilters(state: ResourceFiltersStateModel): ResourceFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([ProfileResourceFiltersState])
  static getCreator(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([ProfileResourceFiltersState])
  static getDateCreated(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([ProfileResourceFiltersState])
  static getFunder(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.funder;
  }

  @Selector([ProfileResourceFiltersState])
  static getSubject(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([ProfileResourceFiltersState])
  static getLicense(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([ProfileResourceFiltersState])
  static getResourceType(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.resourceType;
  }

  @Selector([ProfileResourceFiltersState])
  static getInstitution(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([ProfileResourceFiltersState])
  static getProvider(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }

  @Selector([ProfileResourceFiltersState])
  static getPartOfCollection(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.partOfCollection;
  }
}
