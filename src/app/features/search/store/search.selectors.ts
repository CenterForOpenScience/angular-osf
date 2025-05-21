import { Selector } from '@ngxs/store';

import { SearchStateModel } from '@osf/features/search/store/search.model';
import { SearchState } from '@osf/features/search/store/search.state';
import { Resource } from '@shared/entities/resource-card/resource.entity';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';

export class SearchSelectors {
  @Selector([SearchState])
  static getResources(state: SearchStateModel): Resource[] {
    return state.resources;
  }

  @Selector([SearchState])
  static getResourcesCount(state: SearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([SearchState])
  static getSearchText(state: SearchStateModel): string {
    return state.searchText;
  }

  @Selector([SearchState])
  static getSortBy(state: SearchStateModel): string {
    return state.sortBy;
  }

  @Selector([SearchState])
  static getResourceTab(state: SearchStateModel): ResourceTab {
    return state.resourceTab;
  }

  @Selector([SearchState])
  static getFirst(state: SearchStateModel): string {
    return state.first;
  }

  @Selector([SearchState])
  static getNext(state: SearchStateModel): string {
    return state.next;
  }

  @Selector([SearchState])
  static getPrevious(state: SearchStateModel): string {
    return state.previous;
  }

  @Selector([SearchState])
  static getIsMyProfile(state: SearchStateModel): boolean {
    return state.isMyProfile;
  }
}
