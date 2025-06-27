import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { EMPTY, filter, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
import { PreprintsService } from '@osf/features/preprints/services';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

import {
  CopyFileFromProject,
  CreatePreprint,
  GetAvailableProjects,
  GetPreprintFiles,
  GetPreprintFilesLinks,
  GetProjectFiles,
  GetProjectFilesByLink,
  ResetStateAndDeletePreprint,
  ReuploadFile,
  SetSelectedPreprintFileSource,
  SetSelectedPreprintProviderId,
  SubmitPreprintStateModel,
  UpdatePreprint,
  UploadFile,
} from './';

@State<SubmitPreprintStateModel>({
  name: 'submitPreprint',
  defaults: {
    selectedProviderId: null,
    createdPreprint: {
      data: null,
      isLoading: false,
      error: null,
      isSubmitting: false,
    },
    fileSource: PreprintFileSource.None,
    preprintFilesLinks: {
      data: null,
      isLoading: false,
      error: null,
    },
    preprintFiles: {
      data: [],
      isLoading: false,
      error: null,
    },
    availableProjects: {
      data: [],
      isLoading: false,
      error: null,
    },
    projectFiles: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class SubmitPreprintState {
  private preprintsService = inject(PreprintsService);
  private fileService = inject(FilesService);

  @Action(SetSelectedPreprintProviderId)
  setSelectedPreprintProviderId(ctx: StateContext<SubmitPreprintStateModel>, action: SetSelectedPreprintProviderId) {
    ctx.patchState({
      selectedProviderId: action.id,
    });
  }

  @Action(CreatePreprint)
  createPreprint(ctx: StateContext<SubmitPreprintStateModel>, action: CreatePreprint) {
    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));

    return this.preprintsService.createPreprint(action.title, action.abstract, action.providerId).pipe(
      tap((preprint) => {
        ctx.setState(patch({ createdPreprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => this.handleError(ctx, 'createdPreprint', error))
    );
  }

  @Action(UpdatePreprint)
  updatePreprint(ctx: StateContext<SubmitPreprintStateModel>, action: UpdatePreprint) {
    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));

    return this.preprintsService.updatePreprint(action.id, action.payload).pipe(
      tap((preprint) => {
        ctx.setState(patch({ createdPreprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => this.handleError(ctx, 'createdPreprint', error))
    );
  }

  @Action(GetPreprintFilesLinks)
  getPreprintFilesLinks(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    if (!state.createdPreprint.data) {
      return EMPTY;
    }
    ctx.setState(patch({ preprintFilesLinks: patch({ isLoading: true }) }));

    return this.preprintsService.getPreprintFilesLinks(state.createdPreprint.data.id).pipe(
      tap((preprintStorage) => {
        ctx.setState(patch({ preprintFilesLinks: patch({ isLoading: false, data: preprintStorage }) }));
      })
    );
  }

  @Action(UploadFile)
  uploadFile(ctx: StateContext<SubmitPreprintStateModel>, action: UploadFile) {
    const state = ctx.getState();
    if (!state.preprintFilesLinks.data?.uploadFileLink) {
      return EMPTY;
    }

    ctx.setState(patch({ preprintFiles: patch({ isLoading: true }) }));

    return this.fileService.uploadFileByLink(action.file, state.preprintFilesLinks.data.uploadFileLink).pipe(
      filter((event) => event.type === HttpEventType.Response),
      switchMap((event) => {
        const file = event.body!.data;
        const createdFileId = file.id.split('/')[1];
        ctx.dispatch(new GetPreprintFiles());

        return this.preprintsService.updateFileRelationship(state.createdPreprint.data!.id, createdFileId).pipe(
          tap((preprint: Preprint) => {
            ctx.patchState({
              createdPreprint: {
                ...ctx.getState().createdPreprint,
                data: {
                  ...ctx.getState().createdPreprint.data!,
                  primaryFileId: preprint.primaryFileId,
                },
              },
            });
          }),
          catchError((error) => this.handleError(ctx, 'createdPreprint', error))
        );
      })
    );
  }

  @Action(ReuploadFile)
  reuploadFile(ctx: StateContext<SubmitPreprintStateModel>, action: ReuploadFile) {
    const state = ctx.getState();
    const uploadedFile = state.preprintFiles.data[0];
    if (!uploadedFile) return EMPTY;

    ctx.setState(patch({ preprintFiles: patch({ isLoading: true }) }));

    return this.fileService.updateFileContent(action.file, uploadedFile.links.upload).pipe(
      switchMap(() => this.fileService.renameEntry(uploadedFile.links.upload, action.file.name, 'replace')),
      tap(() => {
        ctx.dispatch(GetPreprintFiles);
      })
    );
  }

  @Action(GetPreprintFiles)
  getPreprintFiles(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    if (!state.preprintFilesLinks.data?.filesLink) {
      return EMPTY;
    }
    ctx.setState(patch({ preprintFiles: patch({ isLoading: true }) }));

    return this.fileService.getFilesWithoutFiltering(state.preprintFilesLinks.data.filesLink).pipe(
      tap((files: OsfFile[]) => {
        ctx.setState(
          patch({
            preprintFiles: patch({
              data: files,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'preprintFiles', error))
    );
  }

  @Action(GetAvailableProjects)
  getAvailableProjects(ctx: StateContext<SubmitPreprintStateModel>, action: GetAvailableProjects) {
    ctx.setState(patch({ availableProjects: patch({ isLoading: true }) }));

    return this.preprintsService.getAvailableProjects(action.searchTerm).pipe(
      tap((projects) => {
        ctx.setState(
          patch({
            availableProjects: patch({
              data: projects,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'availableProjects', error))
    );
  }

  @Action(GetProjectFiles)
  getProjectFiles(ctx: StateContext<SubmitPreprintStateModel>, action: GetProjectFiles) {
    ctx.setState(patch({ projectFiles: patch({ isLoading: true }) }));

    return this.preprintsService.getProjectFiles(action.projectId).pipe(
      tap((files: OsfFile[]) => {
        ctx.setState(
          patch({
            projectFiles: patch({
              data: files,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => {
        ctx.setState(
          patch({
            preprintFiles: patch({
              data: [],
            }),
          })
        );
        return this.handleError(ctx, 'projectFiles', error);
      })
    );
  }

  @Action(GetProjectFilesByLink)
  getProjectFilesByLink(ctx: StateContext<SubmitPreprintStateModel>, action: GetProjectFilesByLink) {
    ctx.setState(patch({ projectFiles: patch({ isLoading: true }) }));

    return this.fileService.getFilesWithoutFiltering(action.filesLink).pipe(
      tap((files: OsfFile[]) => {
        ctx.setState(
          patch({
            projectFiles: patch({
              data: files,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'projectFiles', error))
    );
  }

  @Action(ResetStateAndDeletePreprint)
  resetStateAndDeletePreprint(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    const createdPreprintId = state.createdPreprint.data?.id;
    ctx.setState({
      selectedProviderId: null,
      createdPreprint: {
        data: null,
        isLoading: false,
        error: null,
        isSubmitting: false,
      },
      fileSource: PreprintFileSource.None,
      preprintFilesLinks: {
        data: null,
        isLoading: false,
        error: null,
      },
      preprintFiles: {
        data: [],
        isLoading: false,
        error: null,
      },
      availableProjects: {
        data: [],
        isLoading: false,
        error: null,
      },
      projectFiles: {
        data: [],
        isLoading: false,
        error: null,
      },
    });
    if (createdPreprintId) {
      return this.preprintsService.deletePreprint(createdPreprintId);
    }

    return EMPTY;
  }

  @Action(SetSelectedPreprintFileSource)
  setSelectedPreprintFileSource(ctx: StateContext<SubmitPreprintStateModel>, action: SetSelectedPreprintFileSource) {
    ctx.patchState({
      fileSource: action.fileSource,
    });
  }

  @Action(CopyFileFromProject)
  copyFileFromProject(ctx: StateContext<SubmitPreprintStateModel>, action: CopyFileFromProject) {
    const createdPreprintId = ctx.getState().createdPreprint.data?.id;
    if (!createdPreprintId) {
      return;
    }

    ctx.setState(patch({ preprintFiles: patch({ isLoading: true }) }));
    return this.fileService
      .copyFileToAnotherLocation(action.file.links.move, action.file.provider, createdPreprintId)
      .pipe(
        switchMap((file: OsfFile) => {
          ctx.dispatch(new GetPreprintFiles());

          const fileIdAfterCopy = file.id.split('/')[1];

          return this.preprintsService.updateFileRelationship(createdPreprintId, fileIdAfterCopy).pipe(
            tap((preprint: Preprint) => {
              ctx.patchState({
                createdPreprint: {
                  ...ctx.getState().createdPreprint,
                  data: {
                    ...ctx.getState().createdPreprint.data!,
                    primaryFileId: preprint.primaryFileId,
                  },
                },
              });
            }),
            catchError((error) => this.handleError(ctx, 'createdPreprint', error))
          );
        }),
        catchError((error) => this.handleError(ctx, 'preprintFiles', error))
      );
  }

  private handleError(
    ctx: StateContext<SubmitPreprintStateModel>,
    section: keyof SubmitPreprintStateModel,
    error: Error
  ) {
    ctx.patchState({
      [section]: {
        ...(ctx.getState()[section] as object),
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
