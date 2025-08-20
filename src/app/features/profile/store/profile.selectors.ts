import { Selector } from '@ngxs/store';

import { ResourceTab } from '@osf/shared/enums';
import { Resource, User } from '@osf/shared/models';

import { ProfileStateModel } from './profile.model';
import { ProfileState } from './profile.state';

export class ProfileSelectors {
  @Selector([ProfileState])
  static getResources(state: ProfileStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([ProfileState])
  static getResourcesCount(state: ProfileStateModel): number {
    return state.resourcesCount;
  }

  @Selector([ProfileState])
  static getSearchText(state: ProfileStateModel): string {
    return state.searchText;
  }

  @Selector([ProfileState])
  static getSortBy(state: ProfileStateModel): string {
    return state.sortBy;
  }

  @Selector([ProfileState])
  static getResourceTab(state: ProfileStateModel): ResourceTab {
    return state.resourceTab;
  }

  @Selector([ProfileState])
  static getFirst(state: ProfileStateModel): string {
    return state.first;
  }

  @Selector([ProfileState])
  static getNext(state: ProfileStateModel): string {
    return state.next;
  }

  @Selector([ProfileState])
  static getPrevious(state: ProfileStateModel): string {
    return state.previous;
  }

  @Selector([ProfileState])
  static getIsMyProfile(state: ProfileStateModel): boolean {
    return state.isMyProfile;
  }

  @Selector([ProfileState])
  static getUserProfile(state: ProfileStateModel): User | null {
    return state.user.data;
  }

  @Selector([ProfileState])
  static getIsUserProfile(state: ProfileStateModel): boolean {
    return state.user.isLoading;
  }
}
