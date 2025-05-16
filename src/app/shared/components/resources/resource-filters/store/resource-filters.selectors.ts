import { Selector } from '@ngxs/store';

import {
  ResourceFilterLabel,
  ResourceFiltersStateModel,
} from '@shared/components/resources/resource-filters/store/resource-filters.model';
import { ResourceFiltersState } from '@shared/components/resources/resource-filters/store/resource-filters.state';

export class ResourceFiltersSelectors {
  @Selector([ResourceFiltersState])
  static getAllFilters(state: ResourceFiltersStateModel): ResourceFiltersStateModel {
    return {
      ...state,
    };
  }

  @Selector([ResourceFiltersState])
  static getCreator(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.creator;
  }

  @Selector([ResourceFiltersState])
  static getDateCreated(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.dateCreated;
  }

  @Selector([ResourceFiltersState])
  static getFunder(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.funder;
  }

  @Selector([ResourceFiltersState])
  static getSubject(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.subject;
  }

  @Selector([ResourceFiltersState])
  static getLicense(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.license;
  }

  @Selector([ResourceFiltersState])
  static getResourceType(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.resourceType;
  }

  @Selector([ResourceFiltersState])
  static getInstitution(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.institution;
  }

  @Selector([ResourceFiltersState])
  static getProvider(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.provider;
  }

  @Selector([ResourceFiltersState])
  static getPartOfCollection(state: ResourceFiltersStateModel): ResourceFilterLabel {
    return state.partOfCollection;
  }
}
