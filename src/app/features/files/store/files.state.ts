import { Action, State, StateContext } from '@ngxs/store';

import { catchError, finalize, forkJoin, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { FilesService, ToastService } from '@shared/services';

import { MapResourceMetadata } from '../mappers/resource-metadata.mapper';

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
  GetMoveFileFiles,
  GetRootFolderFiles,
  GetRootFolders,
  RenameEntry,
  ResetState,
  SetCurrentFolder,
  SetFileMetadata,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
  UpdateTags,
} from './files.actions';
import { filesStateDefaults, FilesStateModel } from './files.model';

@Injectable()
@State<FilesStateModel>({
  name: 'filesState',
  defaults: filesStateDefaults,
})
export class FilesState {
  filesService = inject(FilesService);
  toastService = inject(ToastService);

  @Action(GetMoveFileFiles)
  getMoveFileFiles(ctx: StateContext<FilesStateModel>, action: GetMoveFileFiles) {
    const state = ctx.getState();
    ctx.patchState({
      moveFileFiles: { ...state.moveFileFiles, isLoading: true, error: null },
    });

    return this.filesService.getFiles(action.filesLink, '', '').pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            moveFileFiles: {
              data: response.files,
              isLoading: false,
              error: null,
            },
            isAnonymous: response.meta?.anonymous ?? false,
          });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'moveFileFiles', error))
    );
  }

  @Action(GetFiles)
  getFiles(ctx: StateContext<FilesStateModel>, action: GetFiles) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });
    return this.filesService.getFiles(action.filesLink, state.search, state.sort).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            files: {
              data: response.files,
              isLoading: false,
              error: null,
            },
            isAnonymous: response.meta?.anonymous ?? false,
          });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'files', error))
    );
  }

  @Action(SetFilesIsLoading)
  setFilesIsLoading(ctx: StateContext<FilesStateModel>, action: SetFilesIsLoading) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: action.isLoading, error: null } });
  }

  @Action(SetCurrentFolder)
  setSelectedFolder(ctx: StateContext<FilesStateModel>, action: SetCurrentFolder) {
    ctx.patchState({ currentFolder: action.folder });
  }

  @Action(SetMoveFileCurrentFolder)
  setMoveFileSelectedFolder(ctx: StateContext<FilesStateModel>, action: SetMoveFileCurrentFolder) {
    ctx.patchState({ moveFileCurrentFolder: action.folder });
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
    return this.filesService.deleteEntry(action.link).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          if (selectedFolder?.relationships.filesLink) {
            ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          } else {
            ctx.dispatch(new GetRootFolderFiles(action.resourceId));
          }
        },
      })
    );
  }

  @Action(RenameEntry)
  renameEntry(ctx: StateContext<FilesStateModel>, action: RenameEntry) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.filesService.renameEntry(action.link, action.name).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          if (selectedFolder?.relationships.filesLink) {
            ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          } else {
            ctx.dispatch(new GetRootFolderFiles(action.resourceId));
          }
        },
      })
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

  @Action(GetFile)
  getFile(ctx: StateContext<FilesStateModel>, action: GetFile) {
    const state = ctx.getState();
    ctx.patchState({ openedFile: { ...state.openedFile, isLoading: true, error: null } });
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.filesService.getFileTarget(action.fileGuid).pipe(
      tap({
        next: (file) => {
          ctx.patchState({ openedFile: { data: file, isLoading: false, error: null } });
          ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'openedFile', error))
    );
  }

  @Action(GetFileMetadata)
  getFileMetadata(ctx: StateContext<FilesStateModel>, action: GetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.filesService.getFileMetadata(action.fileGuid).pipe(
      tap({
        next: (metadata) => {
          ctx.patchState({ fileMetadata: { data: metadata, isLoading: false, error: null } });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'fileMetadata', error))
    );
  }

  @Action(SetFileMetadata)
  setFileMetadata(ctx: StateContext<FilesStateModel>, action: SetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.filesService.patchFileMetadata(action.payload, action.fileGuid).pipe(
      tap({
        next: (fileMetadata) => {
          if (fileMetadata.id) {
            ctx.patchState({ fileMetadata: { data: fileMetadata, isLoading: false, error: null } });
          }
        },
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
      tap({
        next: (contributors) => {
          ctx.patchState({ contributors: { data: contributors, isLoading: false, error: null } });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'contributors', error))
    );
  }

  @Action(GetFileRevisions)
  getFileRevisions(ctx: StateContext<FilesStateModel>, action: GetFileRevisions) {
    const state = ctx.getState();
    ctx.patchState({ fileRevisions: { ...state.fileRevisions, isLoading: true, error: null } });

    return this.filesService.getFileRevisions(action.resourceId, action.fileProvider, action.fileId).pipe(
      tap({
        next: (revisions) => {
          ctx.patchState({ fileRevisions: { data: revisions, isLoading: false, error: null } });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'fileRevisions', error))
    );
  }

  @Action(UpdateTags)
  updateTags(ctx: StateContext<FilesStateModel>, action: UpdateTags) {
    const state = ctx.getState();
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.filesService.updateTags(action.tags, action.fileGuid).pipe(
      tap({
        next: (file) => {
          ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'tags', error))
    );
  }

  @Action(GetRootFolders)
  getRootFolders(ctx: StateContext<FilesStateModel>, action: GetRootFolders) {
    const state = ctx.getState();
    ctx.patchState({ rootFolders: { ...state.rootFolders, isLoading: true } });

    return this.filesService.getFolders(action.folderLink).pipe(
      tap({
        next: (response) =>
          ctx.patchState({
            rootFolders: {
              data: response.files,
              isLoading: false,
              error: null,
            },
            isAnonymous: response.meta?.anonymous ?? false,
          }),
      }),
      catchError((error) => handleSectionError(ctx, 'rootFolders', error))
    );
  }

  @Action(GetConfiguredStorageAddons)
  getConfiguredStorageAddons(ctx: StateContext<FilesStateModel>, action: GetConfiguredStorageAddons) {
    const state = ctx.getState();
    ctx.patchState({ configuredStorageAddons: { ...state.configuredStorageAddons, isLoading: true } });

    return this.filesService.getConfiguredStorageAddons(action.resourceUri).pipe(
      tap({
        next: (addons) =>
          ctx.patchState({
            configuredStorageAddons: {
              data: addons,
              isLoading: false,
              error: null,
            },
          }),
      }),
      catchError((error) => handleSectionError(ctx, 'configuredStorageAddons', error))
    );
  }

  @Action(ResetState)
  resetState(ctx: StateContext<FilesStateModel>) {
    ctx.patchState(filesStateDefaults);
  }
}
