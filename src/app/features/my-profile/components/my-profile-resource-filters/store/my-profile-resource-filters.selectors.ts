import { Selector } from '@ngxs/store';

import { MyProfileResourceFiltersStateModel } from '@osf/features/my-profile/components/my-profile-resource-filters/store/my-profile-resource-filters.model';
import { ResourceFilterLabel } from '@shared/models';

import { MyProfileResourceFiltersState } from './my-profile-resource-filters.state';

export class MyProfileResourceFiltersSelectors {
  @Selector([MyProfileResourceFiltersState])
  static getAllFilters(state: MyProfileResourceFiltersStateModel): MyProfileResourceFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([MyProfileResourceFiltersState])
  static getCreator(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([MyProfileResourceFiltersState])
  static getDateCreated(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([MyProfileResourceFiltersState])
  static getFunder(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.funder;
  }

  @Selector([MyProfileResourceFiltersState])
  static getSubject(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([MyProfileResourceFiltersState])
  static getLicense(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([MyProfileResourceFiltersState])
  static getResourceType(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.resourceType;
  }

  @Selector([MyProfileResourceFiltersState])
  static getInstitution(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([MyProfileResourceFiltersState])
  static getProvider(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }

  @Selector([MyProfileResourceFiltersState])
  static getPartOfCollection(state: MyProfileResourceFiltersStateModel): ResourceFilterLabel {
    return state.partOfCollection;
  }
}
