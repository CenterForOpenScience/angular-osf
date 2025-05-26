import { Selector } from '@ngxs/store';

import { MyProfileStateModel } from '@osf/features/my-profile/store/my-profile.model';
import { MyProfileState } from '@osf/features/my-profile/store/my-profile.state';
import { ResourceTab } from '@osf/shared/enums/resource-tab.enum';
import { Resource } from '@osf/shared/models/resource-card/resource.model';

export class MyProfileSelectors {
  @Selector([MyProfileState])
  static getResources(state: MyProfileStateModel): Resource[] {
    return state.resources;
  }

  @Selector([MyProfileState])
  static getResourcesCount(state: MyProfileStateModel): number {
    return state.resourcesCount;
  }

  @Selector([MyProfileState])
  static getSearchText(state: MyProfileStateModel): string {
    return state.searchText;
  }

  @Selector([MyProfileState])
  static getSortBy(state: MyProfileStateModel): string {
    return state.sortBy;
  }

  @Selector([MyProfileState])
  static getResourceTab(state: MyProfileStateModel): ResourceTab {
    return state.resourceTab;
  }

  @Selector([MyProfileState])
  static getFirst(state: MyProfileStateModel): string {
    return state.first;
  }

  @Selector([MyProfileState])
  static getNext(state: MyProfileStateModel): string {
    return state.next;
  }

  @Selector([MyProfileState])
  static getPrevious(state: MyProfileStateModel): string {
    return state.previous;
  }

  @Selector([MyProfileState])
  static getIsMyProfile(state: MyProfileStateModel): boolean {
    return state.isMyProfile;
  }
}
