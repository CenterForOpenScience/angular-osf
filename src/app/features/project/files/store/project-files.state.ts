import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, switchMap, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MapProjectMetadata } from '@osf/features/project/files/mappers';
import { ProjectFilesService } from '@osf/features/project/files/services/project-files.service';
import {
  CreateFolder,
  DeleteEntry,
  GetFile,
  GetFileMetadata,
  GetFileProjectContributors,
  GetFileProjectMetadata,
  GetFileRevisions,
  GetFiles,
  GetMoveFileFiles,
  GetMoveFileRootFiles,
  GetRootFolderFiles,
  RenameEntry,
  SetCurrentFolder,
  SetFileMetadata,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort, UpdateTags,
} from '@osf/features/project/files/store/project-files.actions';
import { ProjectFilesStateModel } from '@osf/features/project/files/store/project-files.model';
import { projectFilesStateDefaults } from '@osf/features/project/files/models/data/project-files-state-defaults.const';

@Injectable()
@State<ProjectFilesStateModel>({
  name: 'ProjectFilesState',
  defaults: projectFilesStateDefaults,
})
export class ProjectFilesState {
  projectFilesService = inject(ProjectFilesService);

  @Action(GetRootFolderFiles)
  getRootFolderFiles(ctx: StateContext<ProjectFilesStateModel>, action: GetRootFolderFiles) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.projectFilesService.getRootFolderFiles(action.projectId, state.search, state.sort).pipe(
      switchMap((files) => {
        return this.projectFilesService.getFolder(files[0].relationships.parentFolderLink).pipe(
          tap({
            next: (parentFolder) => {
              console.log('here');
              ctx.patchState({
                files: {
                  data: [...files],
                  isLoading: false,
                  error: null,
                },
                currentFolder: parentFolder,
              });
            },
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'files', error))
    );
  }

  @Action(GetMoveFileRootFiles)
  getMoveFileRootFiles(ctx: StateContext<ProjectFilesStateModel>, action: GetMoveFileRootFiles) {
    const state = ctx.getState();
    ctx.patchState({
      moveFileFiles: { ...state.moveFileFiles, isLoading: true, error: null },
    });

    return this.projectFilesService.getRootFolderFiles(action.projectId, '', '').pipe(
      tap({
        next: (files) => {
          ctx.patchState({
            moveFileFiles: {
              data: files,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'moveFileFiles', error))
    );
  }

  @Action(GetMoveFileFiles)
  getMoveFileFiles(ctx: StateContext<ProjectFilesStateModel>, action: GetMoveFileFiles) {
    const state = ctx.getState();
    ctx.patchState({
      moveFileFiles: { ...state.moveFileFiles, isLoading: true, error: null },
    });

    return this.projectFilesService.getFiles(action.filesLink, '', '').pipe(
      tap({
        next: (files) => {
          ctx.patchState({
            moveFileFiles: {
              data: files,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'moveFileFiles', error))
    );
  }

  @Action(GetFiles)
  getFiles(ctx: StateContext<ProjectFilesStateModel>, action: GetFiles) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.projectFilesService.getFiles(action.filesLink, state.search, state.sort).pipe(
      tap({
        next: (files) => {
          ctx.patchState({
            files: {
              data: files,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'files', error))
    );
  }

  @Action(SetFilesIsLoading)
  setFilesIsLoading(ctx: StateContext<ProjectFilesStateModel>, action: SetFilesIsLoading) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: action.isLoading, error: null } });
  }

  @Action(SetCurrentFolder)
  setSelectedFolder(ctx: StateContext<ProjectFilesStateModel>, action: SetCurrentFolder) {
    console.log('setting current folder');
    ctx.patchState({ currentFolder: action.folder });
  }

  @Action(SetMoveFileCurrentFolder)
  setMoveFileSelectedFolder(ctx: StateContext<ProjectFilesStateModel>, action: SetMoveFileCurrentFolder) {
    ctx.patchState({ moveFileCurrentFolder: action.folder });
  }

  @Action(CreateFolder)
  createFolder(ctx: StateContext<ProjectFilesStateModel>, action: CreateFolder) {
    return this.projectFilesService.createFolder(action.projectId, action.folderName, action.parentFolderId).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          if (selectedFolder?.relationships.filesLink) {
            ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          } else {
            ctx.dispatch(new GetRootFolderFiles(action.projectId));
          }
        },
      })
    );
  }

  @Action(DeleteEntry)
  deleteEntry(ctx: StateContext<ProjectFilesStateModel>, action: DeleteEntry) {
    return this.projectFilesService.deleteEntry(action.link).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          if (selectedFolder?.relationships.filesLink) {
            ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          } else {
            ctx.dispatch(new GetRootFolderFiles(action.projectId));
          }
        },
      })
    );
  }

  @Action(RenameEntry)
  renameEntry(ctx: StateContext<ProjectFilesStateModel>, action: RenameEntry) {
    const state = ctx.getState();
    ctx.patchState({ files: { ...state.files, isLoading: true, error: null } });

    return this.projectFilesService.renameEntry(action.link, action.name).pipe(
      tap({
        next: () => {
          const selectedFolder = ctx.getState().currentFolder;
          if (selectedFolder?.relationships.filesLink) {
            ctx.dispatch(new GetFiles(selectedFolder?.relationships.filesLink));
          } else {
            ctx.dispatch(new GetRootFolderFiles(action.projectId));
          }
        },
      })
    );
  }

  @Action(SetSearch)
  setSearch(ctx: StateContext<ProjectFilesStateModel>, action: SetSearch) {
    ctx.patchState({ search: action.search });
  }

  @Action(SetSort)
  setSort(ctx: StateContext<ProjectFilesStateModel>, action: SetSort) {
    ctx.patchState({ sort: action.sort });
  }

  @Action(GetFile)
  getFile(ctx: StateContext<ProjectFilesStateModel>, action: GetFile) {
    const state = ctx.getState();
    ctx.patchState({ openedFile: { ...state.openedFile, isLoading: true, error: null } });
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.projectFilesService.getFileTarget(action.fileGuid).pipe(
      tap({
        next: (file) => {
          ctx.patchState({ openedFile: { data: file, isLoading: false, error: null } });
          ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
        },
      }),
      catchError((error) => this.handleError(ctx, 'openedFile', error))
    );
  }

  @Action(GetFileMetadata)
  getFileMetadata(ctx: StateContext<ProjectFilesStateModel>, action: GetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.projectFilesService.getFileMetadata(action.fileGuid).pipe(
      tap({
        next: (metadata) => {
          ctx.patchState({ fileMetadata: { data: metadata, isLoading: false, error: null } });
        },
      }),
      catchError((error) => this.handleError(ctx, 'fileMetadata', error))
    );
  }

  @Action(SetFileMetadata)
  setFileMetadata(ctx: StateContext<ProjectFilesStateModel>, action: SetFileMetadata) {
    const state = ctx.getState();
    ctx.patchState({ fileMetadata: { ...state.fileMetadata, isLoading: true, error: null } });

    return this.projectFilesService.patchFileMetadata(action.payload, action.fileGuid).pipe(
      tap({
        next: (fileMetadata) => {
          if (fileMetadata.id) {
            ctx.patchState({ fileMetadata: { data: fileMetadata, isLoading: false, error: null } });
          }
        },
      }),
      catchError((error) => this.handleError(ctx, 'fileMetadata', error))
    );
  }

  @Action(GetFileProjectMetadata)
  getFileProjectMetadata(ctx: StateContext<ProjectFilesStateModel>, action: GetFileProjectMetadata) {
    const state = ctx.getState();
    ctx.patchState({ projectMetadata: { ...state.projectMetadata, isLoading: true, error: null } });

    forkJoin({
      projectShortInfo: this.projectFilesService.getProjectShortInfo(action.projectId),
      projectMetadata: this.projectFilesService.getProjectCustomMetadata(action.projectId),
    })
      .pipe(catchError((error) => this.handleError(ctx, 'projectMetadata', error)))
      .subscribe((results) => {
        const projectMetadata = MapProjectMetadata(results.projectShortInfo, results.projectMetadata);
        ctx.patchState({
          projectMetadata: {
            data: projectMetadata,
            isLoading: false,
            error: null,
          },
        });
      });
  }

  @Action(GetFileProjectContributors)
  getFileProjectContributors(ctx: StateContext<ProjectFilesStateModel>, action: GetFileProjectContributors) {
    const state = ctx.getState();
    ctx.patchState({ contributors: { ...state.contributors, isLoading: true, error: null } });

    return this.projectFilesService.getProjectContributors(action.projectId).pipe(
      tap({
        next: (contributors) => {
          ctx.patchState({ contributors: { data: contributors, isLoading: false, error: null } });
        },
      }),
      catchError((error) => this.handleError(ctx, 'contributors', error))
    );
  }

  @Action(GetFileRevisions)
  getFileRevisions(ctx: StateContext<ProjectFilesStateModel>, action: GetFileRevisions) {
    const state = ctx.getState();
    ctx.patchState({ fileRevisions: { ...state.fileRevisions, isLoading: true, error: null } });

    return this.projectFilesService.getFileRevisions(action.projectId, action.fileId).pipe(
      tap({
        next: (revisions) => {
          ctx.patchState({ fileRevisions: { data: revisions, isLoading: false, error: null } });
        },
      }),
      catchError((error) => this.handleError(ctx, 'fileRevisions', error))
    );
  }

  @Action(UpdateTags)
  updateTags(ctx: StateContext<ProjectFilesStateModel>, action: UpdateTags) {
    const state = ctx.getState();
    ctx.patchState({ tags: { ...state.tags, isLoading: true, error: null } });

    return this.projectFilesService.updateTags(action.tags, action.fileGuid).pipe(
      tap({
        next: (file) => {
          ctx.patchState({ tags: { data: file.tags, isLoading: false, error: null } });
        }
      }),
      catchError((error) => this.handleError(ctx, 'tags', error))
    )
  }

  private handleError(
    ctx: StateContext<ProjectFilesStateModel>,
    section:
      | 'files'
      | 'moveFileFiles'
      | 'openedFile'
      | 'fileMetadata'
      | 'projectMetadata'
      | 'contributors'
      | 'fileRevisions'
      | 'tags',
    error: Error
  ) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
