import { Selector } from '@ngxs/store';

import { Resource } from '@osf/shared/models/resource-card/resource.model';

import { PreprintsSearchState, PreprintsSearchStateModel } from './';

export class PreprintsSearchSelectors {
  @Selector([PreprintsSearchState])
  static getResources(state: PreprintsSearchStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([PreprintsSearchState])
  static getResourcesCount(state: PreprintsSearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([PreprintsSearchState])
  static getSearchText(state: PreprintsSearchStateModel): string {
    return state.searchText;
  }

  @Selector([PreprintsSearchState])
  static getSortBy(state: PreprintsSearchStateModel): string {
    return state.sortBy;
  }

  @Selector([PreprintsSearchState])
  static getFirst(state: PreprintsSearchStateModel): string {
    return state.first;
  }

  @Selector([PreprintsSearchState])
  static getNext(state: PreprintsSearchStateModel): string {
    return state.next;
  }

  @Selector([PreprintsSearchState])
  static getPrevious(state: PreprintsSearchStateModel): string {
    return state.previous;
  }
}
