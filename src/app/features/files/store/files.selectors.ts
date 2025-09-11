import { Selector } from '@ngxs/store';

import { ConfiguredAddonModel, ContributorModel, OsfFile, ResourceMetadata } from '@shared/models';

import { OsfFileCustomMetadata, OsfFileRevision } from '../models';

import { FilesStateModel } from './files.model';
import { FilesState } from './files.state';

export class FilesSelectors {
  @Selector([FilesState])
  static getFiles(state: FilesStateModel): OsfFile[] {
    return state.files.data;
  }

  @Selector([FilesState])
  static getFilesTotalCount(state: FilesStateModel): number {
    return state.files.totalCount;
  }

  @Selector([FilesState])
  static isFilesLoading(state: FilesStateModel): boolean {
    return state.files.isLoading;
  }

  @Selector([FilesState])
  static isFilesAnonymous(state: FilesStateModel): boolean {
    return state.isAnonymous;
  }

  @Selector([FilesState])
  static getMoveFileFiles(state: FilesStateModel): OsfFile[] {
    return state.moveFileFiles.data;
  }

  @Selector([FilesState])
  static getMoveFileFilesTotalCount(state: FilesStateModel): number {
    return state.moveFileFiles.totalCount;
  }

  @Selector([FilesState])
  static isMoveFileFilesLoading(state: FilesStateModel): boolean {
    return state.moveFileFiles.isLoading;
  }

  @Selector([FilesState])
  static getCurrentFolder(state: FilesStateModel): OsfFile | null {
    return state.currentFolder;
  }

  @Selector([FilesState])
  static getMoveFileCurrentFolder(state: FilesStateModel): OsfFile | null {
    return state.moveFileCurrentFolder;
  }

  @Selector([FilesState])
  static getProvider(state: FilesStateModel): string {
    return state.provider;
  }

  @Selector([FilesState])
  static getOpenedFile(state: FilesStateModel): OsfFile | null {
    return state.openedFile.data;
  }

  @Selector([FilesState])
  static isOpenedFileLoading(state: FilesStateModel): boolean {
    return state.openedFile.isLoading;
  }

  @Selector([FilesState])
  static getFileCustomMetadata(state: FilesStateModel): OsfFileCustomMetadata | null {
    return state.fileMetadata.data;
  }

  @Selector([FilesState])
  static isFileMetadataLoading(state: FilesStateModel): boolean {
    return state.fileMetadata.isLoading;
  }

  @Selector([FilesState])
  static getResourceMetadata(state: FilesStateModel): ResourceMetadata | null {
    return state.resourceMetadata.data;
  }

  @Selector([FilesState])
  static isResourceMetadataLoading(state: FilesStateModel): boolean {
    return state.resourceMetadata.isLoading;
  }

  @Selector([FilesState])
  static getContributors(state: FilesStateModel): Partial<ContributorModel>[] | null {
    return state.contributors.data;
  }

  @Selector([FilesState])
  static isResourceContributorsLoading(state: FilesStateModel): boolean {
    return state.contributors.isLoading;
  }

  @Selector([FilesState])
  static getFileRevisions(state: FilesStateModel): OsfFileRevision[] | null {
    return state.fileRevisions.data;
  }

  @Selector([FilesState])
  static isFileRevisionsLoading(state: FilesStateModel): boolean {
    return state.fileRevisions.isLoading;
  }

  @Selector([FilesState])
  static getFileTags(state: FilesStateModel): string[] {
    return state.tags.data;
  }

  @Selector([FilesState])
  static isFileTagsLoading(state: FilesStateModel): boolean {
    return state.tags.isLoading;
  }

  @Selector([FilesState])
  static getRootFolders(state: FilesStateModel): OsfFile[] | null {
    return state.rootFolders.data;
  }

  @Selector([FilesState])
  static isRootFoldersLoading(state: FilesStateModel): boolean {
    return state.rootFolders.isLoading;
  }

  @Selector([FilesState])
  static getConfiguredStorageAddons(state: FilesStateModel): ConfiguredAddonModel[] | null {
    return state.configuredStorageAddons.data;
  }

  @Selector([FilesState])
  static isConfiguredStorageAddonsLoading(state: FilesStateModel): boolean {
    return state.configuredStorageAddons.isLoading;
  }
}
