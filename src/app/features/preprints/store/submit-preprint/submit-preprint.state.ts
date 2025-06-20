import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { EMPTY, take, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
import { PreprintsService } from '@osf/features/preprints/services';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

import {
  CreatePreprint,
  GetAvailableProjects,
  GetPreprintFiles,
  GetPreprintFilesLinks,
  GetProjectFiles,
  GetProjectFilesByLink,
  ResetStateAndDeletePreprint,
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
    createdPreprint: null,
    fileSource: PreprintFileSource.None,
    preprintFilesLinks: null,
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
    return this.preprintsService.createPreprint(action.title, action.abstract, action.providerId).pipe(
      tap((preprint) => {
        ctx.patchState({
          createdPreprint: preprint,
        });
      })
    );
  }

  @Action(UpdatePreprint)
  updatePreprint(ctx: StateContext<SubmitPreprintStateModel>, action: UpdatePreprint) {
    return this.preprintsService.updatePreprint(action.id, action.payload).pipe(
      tap((preprint) => {
        ctx.patchState({
          createdPreprint: preprint,
        });
      })
    );
  }

  @Action(GetPreprintFilesLinks)
  getPreprintFilesLinks(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    if (!state.createdPreprint) {
      return EMPTY;
    }
    return this.preprintsService.getPreprintFilesLinks(state.createdPreprint.id).pipe(
      tap((preprintStorage) => {
        ctx.patchState({
          preprintFilesLinks: preprintStorage,
        });
      })
    );
  }

  @Action(UploadFile)
  uploadFile(ctx: StateContext<SubmitPreprintStateModel>, action: UploadFile) {
    const state = ctx.getState();
    if (!state.preprintFilesLinks?.uploadFileLink) {
      return EMPTY;
    }
    return this.fileService.uploadFileByLink(action.file, state.preprintFilesLinks.uploadFileLink).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          ctx.dispatch(GetPreprintFiles);
          this.preprintsService
            .updateFileRelationship(state.createdPreprint!.id, event.body!.data.id)
            .pipe(
              tap((preprint: Preprint) => {
                ctx.setState((state: SubmitPreprintStateModel) => ({
                  ...state,
                  createdPreprint: state.createdPreprint
                    ? { ...state.createdPreprint, primaryFileId: preprint.primaryFileId }
                    : null,
                }));
              }),
              take(1)
            )
            .subscribe();
        }
      })
    );
  }

  @Action(GetPreprintFiles)
  getPreprintFiles(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    if (!state.preprintFilesLinks?.filesLink) {
      return EMPTY;
    }
    ctx.setState(patch({ preprintFiles: patch({ isLoading: true }) }));

    return this.fileService.getFilesWithoutFiltering(state.preprintFilesLinks.filesLink).pipe(
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
      catchError((error) => {
        ctx.setState(
          patch({
            preprintFiles: patch({
              isLoading: false,
              error: error.message,
            }),
          })
        );
        return throwError(() => error);
      })
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
      catchError((error) => {
        ctx.setState(
          patch({
            availableProjects: patch({
              isLoading: false,
              error: error.message,
            }),
          })
        );
        return throwError(() => error);
      })
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
      })
    );
  }

  @Action(ResetStateAndDeletePreprint)
  resetStateAndDeletePreprint(ctx: StateContext<SubmitPreprintStateModel>) {
    const state = ctx.getState();
    const createdPreprintId = state.createdPreprint?.id;
    ctx.setState({
      selectedProviderId: null,
      createdPreprint: null,
      fileSource: PreprintFileSource.None,
      preprintFilesLinks: null,
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
}
