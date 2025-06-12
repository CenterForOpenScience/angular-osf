import { Selector } from '@ngxs/store';

import { ResourceFilterLabel } from '@shared/models';

import { PreprintsResourcesFiltersStateModel } from './preprints-resources-filters.model';
import { PreprintsResourcesFiltersState } from './preprints-resources-filters.state';

export class PreprintsResourcesFiltersSelectors {
  @Selector([PreprintsResourcesFiltersState])
  static getAllFilters(state: PreprintsResourcesFiltersStateModel): PreprintsResourcesFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([PreprintsResourcesFiltersState])
  static isAnyFilterSelected(state: PreprintsResourcesFiltersStateModel): boolean {
    return Boolean(state.dateCreated.value || state.subject.value || state.license.value || state.provider.value);
  }

  @Selector([PreprintsResourcesFiltersState])
  static getCreator(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([PreprintsResourcesFiltersState])
  static getDateCreated(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([PreprintsResourcesFiltersState])
  static getSubject(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([PreprintsResourcesFiltersState])
  static getInstitution(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([PreprintsResourcesFiltersState])
  static getLicense(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([PreprintsResourcesFiltersState])
  static getProvider(state: PreprintsResourcesFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }
}
