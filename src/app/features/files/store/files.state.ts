import { Action, State, StateContext } from '@ngxs/store';

import { catchError, finalize, forkJoin, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { FilesService, ToastService } from '@shared/services';

import { filesStateDefaults } from '../constants';
import { MapResourceMetadata } from '../mappers/resource-metadata.mapper';

import {
  DeleteEntry,
  GetConfiguredStorageAddons,
  GetFile,
  GetFileMetadata,
  GetFileResourceContributors,
  GetFileResourceMetadata,
  GetFileRevisions,
  GetRootFolders,
  ResetState,
  SetFileMetadata,
  UpdateTags,
} from './files.actions';
import { FilesStateModel } from './files.model';

@Injectable()
@State<FilesStateModel>({
  name: 'filesState',
  defaults: filesStateDefaults,
})
export class FilesState {
  filesService = inject(FilesService);
  toastService = inject(ToastService);

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

  @Action(DeleteEntry)
  deleteEntry(ctx: StateContext<FilesStateModel>, action: DeleteEntry) {
    return this.filesService.deleteEntry(action.link).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          // if (selectedFolder?.relationships.filesLink) {
          //   ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          // } else {
          //   ctx.dispatch(new GetRootFolderFiles(action.resourceId));
          // }
        },
      })
    );
  }

  @Action(GetFileResourceMetadata)
  getFileResourceMetadata(ctx: StateContext<FilesStateModel>, action: GetFileResourceMetadata) {
    const state = ctx.getState();
    ctx.patchState({ resourceMetadata: { ...state.resourceMetadata, isLoading: true, error: null } });

    forkJoin({
      projectShortInfo: this.filesService.getResourceShortInfo(action.resourceId, action.resourceType),
      resourceMetadata: this.filesService.getCustomMetadata(action.resourceId),
    })
      .pipe(catchError((error) => handleSectionError(ctx, 'resourceMetadata', error)))
      .subscribe((results) => {
        const resourceMetadata = MapResourceMetadata(results.projectShortInfo, results.resourceMetadata);
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

    return this.filesService.getFileRevisions(action.resourceId, state.provider, action.fileId).pipe(
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
        next: (folders) =>
          ctx.patchState({
            rootFolders: {
              data: folders,
              isLoading: false,
              error: null,
            },
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
      finalize(() => {
        ctx.patchState({ configuredStorageAddons: { ...state.configuredStorageAddons, isLoading: false } });
      }),
      catchError((error) => handleSectionError(ctx, 'configuredStorageAddons', error))
    );
  }

  @Action(ResetState)
  resetState(ctx: StateContext<FilesStateModel>) {
    ctx.patchState(filesStateDefaults);
  }
}
