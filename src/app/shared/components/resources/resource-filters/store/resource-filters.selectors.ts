import { ResourceFiltersState } from '@shared/components/resources/resource-filters/store/resource-filters.state';
import { Selector } from '@ngxs/store';
import { ResourceFiltersStateModel } from '@shared/components/resources/resource-filters/store/resource-filters.model';
import { ResourceType } from '@osf/features/search/models/resource-type.enum';

export class ResourceFiltersSelectors {
  @Selector([ResourceFiltersState])
  static getCreator(state: ResourceFiltersStateModel): string {
    return state.creator;
  }

  @Selector([ResourceFiltersState])
  static getDateCreated(state: ResourceFiltersStateModel): Date {
    return state.dateCreated;
  }

  @Selector([ResourceFiltersState])
  static getFunder(state: ResourceFiltersStateModel): string {
    return state.funder;
  }

  @Selector([ResourceFiltersState])
  static getSubject(state: ResourceFiltersStateModel): string {
    return state.subject;
  }

  @Selector([ResourceFiltersState])
  static getLicense(state: ResourceFiltersStateModel): string {
    return state.license;
  }

  @Selector([ResourceFiltersState])
  static getResourceType(state: ResourceFiltersStateModel): ResourceType {
    return state.resourceType;
  }

  @Selector([ResourceFiltersState])
  static getInstitution(state: ResourceFiltersStateModel): string {
    return state.institution;
  }

  @Selector([ResourceFiltersState])
  static getProvider(state: ResourceFiltersStateModel): string {
    return state.provider;
  }

  @Selector([ResourceFiltersState])
  static getPartOfCollection(state: ResourceFiltersStateModel): string {
    return state.partOfCollection;
  }
}
