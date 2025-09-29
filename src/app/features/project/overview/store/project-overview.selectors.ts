import { Selector } from '@ngxs/store';

import { UserPermissions } from '@osf/shared/enums';

import { ProjectOverviewStateModel } from './project-overview.model';
import { ProjectOverviewState } from './project-overview.state';

export class ProjectOverviewSelectors {
  @Selector([ProjectOverviewState])
  static getProject(state: ProjectOverviewStateModel) {
    return state.project.data;
  }

  @Selector([ProjectOverviewState])
  static getProjectLoading(state: ProjectOverviewStateModel) {
    return state.project.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getComponents(state: ProjectOverviewStateModel) {
    return state.components.data;
  }

  @Selector([ProjectOverviewState])
  static getComponentsLoading(state: ProjectOverviewStateModel) {
    return state.components.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getComponentsSubmitting(state: ProjectOverviewStateModel) {
    return state.components.isSubmitting;
  }

  @Selector([ProjectOverviewState])
  static getForkProjectSubmitting(state: ProjectOverviewStateModel) {
    return state.project.isSubmitting;
  }

  @Selector([ProjectOverviewState])
  static getDuplicateProjectSubmitting(state: ProjectOverviewStateModel) {
    return state.project.isSubmitting;
  }

  @Selector([ProjectOverviewState])
  static getUpdatePublicStatusSubmitting(state: ProjectOverviewStateModel) {
    return state.project.isSubmitting;
  }

  @Selector([ProjectOverviewState])
  static isProjectAnonymous(state: ProjectOverviewStateModel) {
    return state.isAnonymous;
  }

  @Selector([ProjectOverviewState])
  static getDuplicatedProject(state: ProjectOverviewStateModel) {
    return state.duplicatedProject;
  }

  @Selector([ProjectOverviewState])
  static hasWriteAccess(state: ProjectOverviewStateModel): boolean {
    return state.project.data?.currentUserPermissions.includes(UserPermissions.Write) || false;
  }

  @Selector([ProjectOverviewState])
  static hasAdminAccess(state: ProjectOverviewStateModel): boolean {
    return state.project.data?.currentUserPermissions.includes(UserPermissions.Admin) || false;
  }

  @Selector([ProjectOverviewState])
  static hasNoPermissions(state: ProjectOverviewStateModel): boolean {
    return !state.project.data?.currentUserPermissions.length;
  }
}
