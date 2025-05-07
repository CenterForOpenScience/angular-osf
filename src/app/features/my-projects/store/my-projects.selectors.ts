import { Selector } from '@ngxs/store';
import { MyProjectsStateModel } from './my-projects.model';
import { MyProjectsState } from '@osf/features/my-projects/store/my-projects.state';

export class MyProjectsSelectors {
  @Selector([MyProjectsState])
  static getProjects(state: MyProjectsStateModel) {
    return state.projects;
  }

  @Selector([MyProjectsState])
  static getRegistrations(state: MyProjectsStateModel) {
    return state.registrations;
  }

  @Selector([MyProjectsState])
  static getPreprints(state: MyProjectsStateModel) {
    return state.preprints;
  }

  @Selector([MyProjectsState])
  static getBookmarks(state: MyProjectsStateModel) {
    return state.bookmarks;
  }

  @Selector([MyProjectsState])
  static getTotalProjectsCount(state: MyProjectsStateModel) {
    return state.totalProjects;
  }

  @Selector([MyProjectsState])
  static getTotalRegistrationsCount(state: MyProjectsStateModel) {
    return state.totalRegistrations;
  }

  @Selector([MyProjectsState])
  static getTotalPreprintsCount(state: MyProjectsStateModel) {
    return state.totalPreprints;
  }

  @Selector([MyProjectsState])
  static getTotalBookmarksCount(state: MyProjectsStateModel) {
    return state.totalBookmarks;
  }

  @Selector([MyProjectsState])
  static getBookmarksCollectionId(state: MyProjectsStateModel) {
    return state.bookmarksId;
  }
}
