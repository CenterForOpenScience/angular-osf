import { Selector } from '@ngxs/store';

import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { FileDetailsModel, FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { ResourceMetadata } from '@osf/shared/models/resource-metadata.model';

import { OsfFileCustomMetadata, OsfFileRevision } from '../models';

import { FilesStateModel } from './files.model';
import { FilesState } from './files.state';

export class FilesSelectors {
  @Selector([FilesState])
  static getFiles(state: FilesStateModel): FileModel[] {
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
  static getMoveDialogFiles(state: FilesStateModel): FileModel[] {
    return state.moveDialogFiles.data;
  }

  @Selector([FilesState])
  static getMoveDialogFilesTotalCount(state: FilesStateModel): number {
    return state.moveDialogFiles.totalCount;
  }

  @Selector([FilesState])
  static isMoveDialogFilesLoading(state: FilesStateModel): boolean {
    return state.moveDialogFiles.isLoading;
  }

  @Selector([FilesState])
  static getCurrentFolder(state: FilesStateModel): FileFolderModel | null {
    return state.currentFolder;
  }

  @Selector([FilesState])
  static getMoveDialogCurrentFolder(state: FilesStateModel): FileFolderModel | null {
    return state.moveDialogCurrentFolder;
  }

  @Selector([FilesState])
  static getProvider(state: FilesStateModel): string {
    return state.provider;
  }

  @Selector([FilesState])
  static getOpenedFile(state: FilesStateModel): FileDetailsModel | null {
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
  static getContributors(state: FilesStateModel): ContributorModel[] {
    return state.contributors.data || [];
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
  static getRootFolders(state: FilesStateModel): FileFolderModel[] | null {
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

  @Selector([FilesState])
  static getMoveDialogRootFolders(state: FilesStateModel): FileFolderModel[] | null {
    return state.moveDialogRootFolders.data;
  }

  @Selector([FilesState])
  static isMoveDialogRootFoldersLoading(state: FilesStateModel): boolean {
    return state.moveDialogRootFolders.isLoading;
  }

  @Selector([FilesState])
  static getMoveDialogConfiguredStorageAddons(state: FilesStateModel): ConfiguredAddonModel[] | null {
    return state.moveDialogConfiguredStorageAddons.data;
  }

  @Selector([FilesState])
  static isMoveDialogConfiguredStorageAddonsLoading(state: FilesStateModel): boolean {
    return state.moveDialogConfiguredStorageAddons.isLoading;
  }

  @Selector([FilesState])
  static getStorageSupportedFeatures(state: FilesStateModel): Record<string, SupportedFeature[]> {
    return state.storageSupportedFeatures || {};
  }

  @Selector([FilesState])
  static hasWriteAccess(state: FilesStateModel): boolean {
    return state.openedFile.data?.target?.currentUserPermissions?.includes(UserPermissions.Write) || false;
  }
}
