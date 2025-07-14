import { Selector } from '@ngxs/store';

import {
  OsfFileCustomMetadata,
  OsfFileProjectContributor,
  OsfFileRevision,
  OsfProjectMetadata,
} from '@osf/features/project/files/models';
import { OsfFile } from '@shared/models';
import { ConfiguredStorageAddon } from '@shared/models/addons';

import { ProjectFilesStateModel } from './project-files.model';
import { ProjectFilesState } from './project-files.state';

export class ProjectFilesSelectors {
  @Selector([ProjectFilesState])
  static getFiles(state: ProjectFilesStateModel): OsfFile[] {
    return state.files.data;
  }

  @Selector([ProjectFilesState])
  static isFilesLoading(state: ProjectFilesStateModel): boolean {
    return state.files.isLoading;
  }

  @Selector([ProjectFilesState])
  static getMoveFileFiles(state: ProjectFilesStateModel): OsfFile[] {
    return state.moveFileFiles.data;
  }

  @Selector([ProjectFilesState])
  static isMoveFileFilesLoading(state: ProjectFilesStateModel): boolean {
    return state.moveFileFiles.isLoading;
  }

  @Selector([ProjectFilesState])
  static getCurrentFolder(state: ProjectFilesStateModel): OsfFile | null {
    return state.currentFolder;
  }

  @Selector([ProjectFilesState])
  static getMoveFileCurrentFolder(state: ProjectFilesStateModel): OsfFile | null {
    return state.moveFileCurrentFolder;
  }

  @Selector([ProjectFilesState])
  static getProvider(state: ProjectFilesStateModel): string {
    return state.provider;
  }

  @Selector([ProjectFilesState])
  static getOpenedFile(state: ProjectFilesStateModel): OsfFile | null {
    return state.openedFile.data;
  }

  @Selector([ProjectFilesState])
  static isOpenedFileLoading(state: ProjectFilesStateModel): boolean {
    return state.openedFile.isLoading;
  }

  @Selector([ProjectFilesState])
  static getFileCustomMetadata(state: ProjectFilesStateModel): OsfFileCustomMetadata | null {
    return state.fileMetadata.data;
  }

  @Selector([ProjectFilesState])
  static isFileMetadataLoading(state: ProjectFilesStateModel): boolean {
    return state.fileMetadata.isLoading;
  }

  @Selector([ProjectFilesState])
  static getProjectMetadata(state: ProjectFilesStateModel): OsfProjectMetadata | null {
    return state.projectMetadata.data;
  }

  @Selector([ProjectFilesState])
  static isProjectMetadataLoading(state: ProjectFilesStateModel): boolean {
    return state.projectMetadata.isLoading;
  }

  @Selector([ProjectFilesState])
  static getProjectContributors(state: ProjectFilesStateModel): OsfFileProjectContributor[] | null {
    return state.contributors.data;
  }

  @Selector([ProjectFilesState])
  static isProjectContributorsLoading(state: ProjectFilesStateModel): boolean {
    return state.contributors.isLoading;
  }

  @Selector([ProjectFilesState])
  static getFileRevisions(state: ProjectFilesStateModel): OsfFileRevision[] | null {
    return state.fileRevisions.data;
  }

  @Selector([ProjectFilesState])
  static isFileRevisionsLoading(state: ProjectFilesStateModel): boolean {
    return state.fileRevisions.isLoading;
  }

  @Selector([ProjectFilesState])
  static getFileTags(state: ProjectFilesStateModel): string[] {
    return state.tags.data;
  }

  @Selector([ProjectFilesState])
  static isFileTagsLoading(state: ProjectFilesStateModel): boolean {
    return state.tags.isLoading;
  }

  @Selector([ProjectFilesState])
  static getRootFolders(state: ProjectFilesStateModel): OsfFile[] | null {
    return state.rootFolders.data;
  }

  @Selector([ProjectFilesState])
  static isRootFoldersLoading(state: ProjectFilesStateModel): boolean {
    return state.rootFolders.isLoading;
  }

  @Selector([ProjectFilesState])
  static getConfiguredStorageAddons(state: ProjectFilesStateModel): ConfiguredStorageAddon[] | null {
    return state.configuredStorageAddons.data;
  }

  @Selector([ProjectFilesState])
  static isConfiguredStorageAddonsLoading(state: ProjectFilesStateModel): boolean {
    return state.configuredStorageAddons.isLoading;
  }
}
