import { Selector } from '@ngxs/store';

import { MyProjectsItem } from '@osf/features/my-projects/models/my-projects.models';

import { MyProjectsStateModel } from './my-projects.model';
import { MyProjectsState } from './my-projects.state';

export class MyProjectsSelectors {
  @Selector([MyProjectsState])
  static getProjects(state: MyProjectsStateModel): MyProjectsItem[] {
    return state.projects.data;
  }

  @Selector([MyProjectsState])
  static getRegistrations(state: MyProjectsStateModel): MyProjectsItem[] {
    return state.registrations.data;
  }

  @Selector([MyProjectsState])
  static getPreprints(state: MyProjectsStateModel): MyProjectsItem[] {
    return state.preprints.data;
  }

  @Selector([MyProjectsState])
  static getBookmarks(state: MyProjectsStateModel): MyProjectsItem[] {
    return state.bookmarks.data;
  }

  @Selector([MyProjectsState])
  static getTotalProjects(state: MyProjectsStateModel): number {
    return state.totalProjects;
  }

  @Selector([MyProjectsState])
  static getTotalRegistrations(state: MyProjectsStateModel): number {
    return state.totalRegistrations;
  }

  @Selector([MyProjectsState])
  static getTotalPreprints(state: MyProjectsStateModel): number {
    return state.totalPreprints;
  }

  @Selector([MyProjectsState])
  static getTotalBookmarks(state: MyProjectsStateModel): number {
    return state.totalBookmarks;
  }

  @Selector([MyProjectsState])
  static getBookmarksLoading(state: MyProjectsStateModel): boolean {
    return state.bookmarks.isLoading;
  }
}
