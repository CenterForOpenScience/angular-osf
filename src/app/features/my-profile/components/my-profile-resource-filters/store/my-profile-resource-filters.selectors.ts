import { Selector } from '@ngxs/store';

import { ResourceFiltersStateModel } from '@osf/features/search/components/resource-filters/store';
import { ResourceFilterLabel } from '@shared/models';

import { MyProfileResourceFiltersState } from './my-profile-resource-filters.state';

export class MyProfileResourceFiltersSelectors {
  @Selector([MyProfileResourceFiltersState])
  static getAllFilters(state: ResourceFiltersStateModel): ResourceFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([MyProfileResourceFiltersState])
  static getCreator(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([MyProfileResourceFiltersState])
  static getDateCreated(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([MyProfileResourceFiltersState])
  static getFunder(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.funder;
  }

  @Selector([MyProfileResourceFiltersState])
  static getSubject(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([MyProfileResourceFiltersState])
  static getLicense(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([MyProfileResourceFiltersState])
  static getResourceType(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.resourceType;
  }

  @Selector([MyProfileResourceFiltersState])
  static getInstitution(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([MyProfileResourceFiltersState])
  static getProvider(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }

  @Selector([MyProfileResourceFiltersState])
  static getPartOfCollection(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.partOfCollection;
  }
}
