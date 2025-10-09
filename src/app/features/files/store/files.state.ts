import { Action, State, StateContext } from '@ngxs/store';

import { catchError, finalize, forkJoin, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SupportedFeature } from '@osf/shared/enums';
import { handleSectionError } from '@osf/shared/helpers';
import { FilesService, ToastService } from '@osf/shared/services';

import { MapResourceMetadata } from '../mappers';

import {
  CreateFolder,
  DeleteEntry,
  GetConfiguredStorageAddons,
  GetFile,
  GetFileMetadata,
  GetFileResourceContributors,
  GetFileResourceMetadata,
  GetFileRevisions,
  GetFiles,
  GetMoveDialogConfiguredStorageAddons,
  GetMoveDialogFiles,
  GetMoveDialogRootFolders,
  GetRootFolders,
  GetStorageSupportedFeatures,
  RenameEntry,
  ResetState,
  SetCurrentFolder,
  SetCurrentProvider,
  SetFileMetadata,
  SetMoveDialogCurrentFolder,
  SetSearch,
  SetSort,
  UpdateTags,
} from './files.actions';
import { FILES_STATE_DEFAULTS, FilesStateModel } from './files.model';

@Injectable()
@State<FilesStateModel>({
  name: 'files',
  defaults: FILES_STATE_DEFAULTS,
})
export class FilesState {
  filesService = inject(FilesService);
  toastService = inject(ToastService);

  @Action(GetFiles)
  getFiles(ctx: StateContext<FilesStateModel>, action: GetFiles) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null, totalCount: 0 } });
    return this.filesService.getFiles(action.filesLink, state.search, state.sort, action.page).pipe(
      tap((response) => {
        const newData = action.page === 1 ? response.files : [...(state.files.data ?? []), ...response.files];
        ctx.patchState({
          files: {
            data: newData,
            isLoading: false,
            error: null,
            totalCount: response.meta?.total ?? 0,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'files', error))
    );
  }

  @Action(GetMoveDialogFiles)
  getMoveDialogFiles(ctx: StateContext<FilesStateModel>, action: GetMoveDialogFiles) {
    const state = ctx.getState();
    ctx.patchState({
      moveDialogFiles: { ...state.moveDialogFiles, isLoading: true, error: null, totalCount: 0 },
    });
    return this.filesService.getFiles(action.filesLink, state.search, state.sort, action.page).pipe(
      tap((response) => {
        const newData = action.page === 1 ? response.files : [...(state.moveDialogFiles.data ?? []), ...response.files];
        ctx.patchState({
          moveDialogFiles: {
            data: newData,
            isLoading: false,
            error: null,
            totalCount: response.meta?.total ?? 0,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moveDialogFiles', error))
    );
  }

  @Action(SetCurrentFolder)
  setSelectedFolder(ctx: StateContext<FilesStateModel>, action: SetCurrentFolder) {
    ctx.patchState({ currentFolder: action.folder });
  }

  @Action(SetMoveDialogCurrentFolder)
  setMoveDialogCurrentFolder(ctx: StateContext<FilesStateModel>, action: SetMoveDialogCurrentFolder) {
    ctx.patchState({ moveDialogCurrentFolder: action.folder });
  }

  @Action(CreateFolder)
  createFolder(ctx: StateContext<FilesStateModel>, action: CreateFolder) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.filesService
      .createFolder(action.newFolderLink, action.folderName)
      .pipe(finalize(() => ctx.patchState({ files: { ...state.files, isLoading: false, error: null } })));
  }

  @Action(DeleteEntry)
  deleteEntry(ctx: StateContext<FilesStateModel>, action: DeleteEntry) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });
    return this.filesService.deleteEntry(action.link).pipe(
      tap(() => {
        ctx.patchState({ files: { ...state.files, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'files', error))
    );
  }

  @Action(RenameEntry)
  renameEntry(ctx: StateContext<FilesStateModel>, action: RenameEntry) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.filesService.renameEntry(action.link, action.name).pipe(
      tap(() => {
        ctx.patchState({ files: { ...state.files, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'files', error))
    );
  }

  @Action(SetSearch)
  setSearch(ctx: StateContext<FilesStateModel>, action: SetSearch) {
    ctx.patchState({ search: action.search });
  }

  @Action(SetSort)
  setSort(ctx: StateContext<FilesStateModel>, action: SetSort) {
    ctx.patchState({ sort: action.sort });
  }

  @Action(SetCurrentProvider)
  setCurrentProvider(ctx: StateContext<FilesStateModel>, action: SetCurrentProvider) {
    ctx.patchState({ provider: action.provider });
  }

  @Action(GetFile)
  getFile(ctx: StateContext<FilesStateModel>, action: GetFile) {
    const state = ctx.getState();
    ctx.patchState({ openedFile: { ...state.openedFile, isLoading: true, error: null } });
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.filesService.getFileTarget(action.fileGuid).pipe(
      tap((file) => {
        ctx.patchState({ openedFile: { data: file, isLoading: false, error: null } });
        ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'openedFile', error))
    );
  }

  @Action(GetFileMetadata)
  getFileMetadata(ctx: StateContext<FilesStateModel>, action: GetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.filesService.getFileMetadata(action.fileGuid).pipe(
      tap((metadata) => {
        ctx.patchState({ fileMetadata: { data: metadata, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'fileMetadata', error))
    );
  }

  @Action(SetFileMetadata)
  setFileMetadata(ctx: StateContext<FilesStateModel>, action: SetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.filesService.patchFileMetadata(action.payload, action.fileGuid).pipe(
      tap((fileMetadata) => {
        if (fileMetadata.id) {
          ctx.patchState({ fileMetadata: { data: fileMetadata, isLoading: false, error: null } });
        }
      }),
      catchError((error) => handleSectionError(ctx, 'fileMetadata', error))
    );
  }

  @Action(GetFileResourceMetadata)
  getFileResourceMetadata(ctx: StateContext<FilesStateModel>, action: GetFileResourceMetadata) {
    const state = ctx.getState();
    ctx.patchState({ resourceMetadata: { ...state.resourceMetadata, isLoading: true, error: null } });

    forkJoin({
      resourceShortInfo: this.filesService.getResourceShortInfo(action.resourceId, action.resourceType),
      resourceMetadata: this.filesService.getCustomMetadata(action.resourceId),
    })
      .pipe(catchError((error) => handleSectionError(ctx, 'resourceMetadata', error)))
      .subscribe((results) => {
        const resourceMetadata = MapResourceMetadata(results.resourceShortInfo, results.resourceMetadata);
        ctx.patchState({
          resourceMetadata: {
            data: resourceMetadata,
            isLoading: false,
            error: null,
          },
        });
      });
  }

  @Action(GetFileResourceContributors)
  getFileResourceContributors(ctx: StateContext<FilesStateModel>, action: GetFileResourceContributors) {
    const state = ctx.getState();
    ctx.patchState({ contributors: { ...state.contributors, isLoading: true, error: null } });

    return this.filesService.getResourceContributors(action.resourceId, action.resourceType).pipe(
      tap((contributors) => {
        ctx.patchState({ contributors: { data: contributors, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'contributors', error))
    );
  }

  @Action(GetFileRevisions)
  getFileRevisions(ctx: StateContext<FilesStateModel>, action: GetFileRevisions) {
    const state = ctx.getState();
    ctx.patchState({ fileRevisions: { ...state.fileRevisions, isLoading: true, error: null } });

    return this.filesService.getFileRevisions(action.link).pipe(
      tap((revisions) => {
        ctx.patchState({ fileRevisions: { data: revisions, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'fileRevisions', error))
    );
  }

  @Action(UpdateTags)
  updateTags(ctx: StateContext<FilesStateModel>, action: UpdateTags) {
    const state = ctx.getState();
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.filesService.updateTags(action.tags, action.fileGuid).pipe(
      tap((file) => {
        ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tags', error))
    );
  }

  @Action(GetRootFolders)
  getRootFolders(ctx: StateContext<FilesStateModel>, action: GetRootFolders) {
    const state = ctx.getState();
    ctx.patchState({ rootFolders: { ...state.rootFolders, isLoading: true } });
    return this.filesService.getFolders(action.folderLink).pipe(
      tap((response) =>
        ctx.patchState({
          rootFolders: {
            data: response.files,
            isLoading: false,
            error: null,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        })
      ),
      catchError((error) => handleSectionError(ctx, 'rootFolders', error))
    );
  }

  @Action(GetMoveDialogRootFolders)
  getMoveDialogRootFolders(ctx: StateContext<FilesStateModel>, action: GetMoveDialogRootFolders) {
    const state = ctx.getState();
    ctx.patchState({ moveDialogRootFolders: { ...state.moveDialogRootFolders, isLoading: true } });

    return this.filesService.getFolders(action.folderLink).pipe(
      tap((response) =>
        ctx.patchState({
          moveDialogRootFolders: {
            data: response.files,
            isLoading: false,
            error: null,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        })
      ),
      catchError((error) => handleSectionError(ctx, 'moveDialogRootFolders', error))
    );
  }

  @Action(GetConfiguredStorageAddons)
  getConfiguredStorageAddons(ctx: StateContext<FilesStateModel>, action: GetConfiguredStorageAddons) {
    const state = ctx.getState();
    ctx.patchState({ configuredStorageAddons: { ...state.configuredStorageAddons, isLoading: true } });

    return this.filesService.getConfiguredStorageAddons(action.resourceUri).pipe(
      tap((addons) =>
        ctx.patchState({
          configuredStorageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        })
      ),
      catchError((error) => handleSectionError(ctx, 'configuredStorageAddons', error))
    );
  }

  @Action(GetMoveDialogConfiguredStorageAddons)
  getMoveDialogConfiguredStorageAddons(
    ctx: StateContext<FilesStateModel>,
    action: GetMoveDialogConfiguredStorageAddons
  ) {
    const state = ctx.getState();
    ctx.patchState({
      moveDialogConfiguredStorageAddons: { ...state.moveDialogConfiguredStorageAddons, isLoading: true },
    });

    return this.filesService.getConfiguredStorageAddons(action.resourceUri).pipe(
      tap((addons) =>
        ctx.patchState({
          moveDialogConfiguredStorageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        })
      ),
      catchError((error) => handleSectionError(ctx, 'moveDialogConfiguredStorageAddons', error))
    );
  }

  @Action(GetStorageSupportedFeatures)
  getStorageSupportedFeatures(ctx: StateContext<FilesStateModel>, action: GetStorageSupportedFeatures) {
    if (ctx.getState().storageSupportedFeatures[action.providerName]) {
      return of(null);
    }
    return this.filesService.getExternalStorageService(action.storageId).pipe(
      tap((addon) => {
        const providerName = addon.externalServiceName;
        const currentFeatures = ctx.getState().storageSupportedFeatures;
        ctx.patchState({
          storageSupportedFeatures: {
            ...currentFeatures,
            [providerName]: (addon.supportedFeatures ?? []) as SupportedFeature[],
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'storageSupportedFeatures', error))
    );
  }

  @Action(ResetState)
  resetState(ctx: StateContext<FilesStateModel>) {
    ctx.patchState(FILES_STATE_DEFAULTS);
  }
}
