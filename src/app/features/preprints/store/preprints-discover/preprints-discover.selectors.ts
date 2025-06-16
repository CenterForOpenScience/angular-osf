import { Selector } from '@ngxs/store';

import { Resource } from '@shared/models';

import { PreprintsDiscoverStateModel } from './preprints-discover.model';
import { PreprintsDiscoverState } from './preprints-discover.state';

export class PreprintsDiscoverSelectors {
  @Selector([PreprintsDiscoverState])
  static getResources(state: PreprintsDiscoverStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([PreprintsDiscoverState])
  static getResourcesCount(state: PreprintsDiscoverStateModel): number {
    return state.resourcesCount;
  }

  @Selector([PreprintsDiscoverState])
  static getSearchText(state: PreprintsDiscoverStateModel): string {
    return state.searchText;
  }

  @Selector([PreprintsDiscoverState])
  static getSortBy(state: PreprintsDiscoverStateModel): string {
    return state.sortBy;
  }

  @Selector([PreprintsDiscoverState])
  static getIri(state: PreprintsDiscoverStateModel): string {
    return state.providerIri;
  }

  @Selector([PreprintsDiscoverState])
  static getFirst(state: PreprintsDiscoverStateModel): string {
    return state.first;
  }

  @Selector([PreprintsDiscoverState])
  static getNext(state: PreprintsDiscoverStateModel): string {
    return state.next;
  }

  @Selector([PreprintsDiscoverState])
  static getPrevious(state: PreprintsDiscoverStateModel): string {
    return state.previous;
  }
}
