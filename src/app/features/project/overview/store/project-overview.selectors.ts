import { Selector } from '@ngxs/store';

import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

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

  @Selector([ProjectOverviewState])
  static isWikiEnabled(state: ProjectOverviewStateModel): boolean {
    return !!state.project.data?.wikiEnabled;
  }

  @Selector([ProjectOverviewState])
  static getParentProject(state: ProjectOverviewStateModel) {
    return state.parentProject.data;
  }

  @Selector([ProjectOverviewState])
  static getParentProjectLoading(state: ProjectOverviewStateModel) {
    return state.parentProject.isLoading;
  }

  @Selector([ProjectOverviewState])
  static hasMoreComponents(state: ProjectOverviewStateModel) {
    return state.components.data.length < state.components.totalCount && !state.components.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getInstitutions(state: ProjectOverviewStateModel) {
    return state.institutions.data;
  }

  @Selector([ProjectOverviewState])
  static isInstitutionsLoading(state: ProjectOverviewStateModel) {
    return state.institutions.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getIdentifiers(state: ProjectOverviewStateModel) {
    return state.identifiers.data;
  }

  @Selector([ProjectOverviewState])
  static isIdentifiersLoading(state: ProjectOverviewStateModel) {
    return state.identifiers.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getLicense(state: ProjectOverviewStateModel) {
    return state.license.data;
  }

  @Selector([ProjectOverviewState])
  static isLicenseLoading(state: ProjectOverviewStateModel) {
    return state.license.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getStorage(state: ProjectOverviewStateModel) {
    return state.storage.data;
  }

  @Selector([ProjectOverviewState])
  static isStorageLoading(state: ProjectOverviewStateModel) {
    return state.storage.isLoading;
  }

  @Selector([ProjectOverviewState])
  static getPreprints(state: ProjectOverviewStateModel) {
    return state.preprints.data;
  }

  @Selector([ProjectOverviewState])
  static isPreprintsLoading(state: ProjectOverviewStateModel) {
    return state.preprints.isLoading;
  }
}
