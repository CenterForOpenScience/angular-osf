import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { EMPTY, filter, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint } from '@osf/features/preprints/models';
import {
  PreprintFilesService,
  PreprintLicensesService,
  PreprintsProjectsService,
  PreprintsService,
  PreprintSubjectsService,
} from '@osf/features/preprints/services';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

import {
  ConnectProject,
  CopyFileFromProject,
  CreateNewProject,
  CreatePreprint,
  DisconnectProject,
  FetchLicenses,
  FetchPreprintProject,
  FetchPreprintsSubjects,
  GetAvailableProjects,
  GetPreprintFiles,
  GetPreprintFilesLinks,
  GetProjectFiles,
  GetProjectFilesByLink,
  ResetStateAndDeletePreprint,
  ReuploadFile,
  SaveLicense,
  SetSelectedPreprintFileSource,
  SetSelectedPreprintProviderId,
  SubmitPreprintStateModel,
  UpdatePreprint,
  UpdatePreprintsSubjects,
  UploadFile,
} from './';

const DefaultState: SubmitPreprintStateModel = {
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
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  subjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintProject: {
    data: null,
    isLoading: false,
    error: null,
  },
};

@State<SubmitPreprintStateModel>({
  name: 'submitPreprint',
  defaults: { ...DefaultState },
})
@Injectable()
export class SubmitPreprintState {
  private preprintsService = inject(PreprintsService);
  private preprintFilesService = inject(PreprintFilesService);
  private fileService = inject(FilesService);
  private licensesService = inject(PreprintLicensesService);
  private subjectsService = inject(PreprintSubjectsService);
  private preprintProjectsService = inject(PreprintsProjectsService);

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

    return this.preprintFilesService.getPreprintFilesLinks(state.createdPreprint.data.id).pipe(
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

        return this.preprintFilesService.updateFileRelationship(state.createdPreprint.data!.id, createdFileId).pipe(
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

    return this.preprintProjectsService.getAvailableProjects(action.searchTerm).pipe(
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

    return this.preprintFilesService.getProjectFiles(action.projectId).pipe(
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
    ctx.setState({ ...DefaultState });
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

          return this.preprintFilesService.updateFileRelationship(createdPreprintId, fileIdAfterCopy).pipe(
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

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<SubmitPreprintStateModel>) {
    const providerId = ctx.getState().selectedProviderId;
    if (!providerId) return;
    ctx.setState(patch({ licenses: patch({ isLoading: true }) }));

    return this.licensesService.getLicenses(providerId).pipe(
      tap((licenses) => {
        ctx.setState(patch({ licenses: patch({ isLoading: false, data: licenses }) }));
      }),
      catchError((error) => this.handleError(ctx, 'licenses', error))
    );
  }

  @Action(SaveLicense)
  saveLicense(ctx: StateContext<SubmitPreprintStateModel>, action: SaveLicense) {
    const createdPreprintId = ctx.getState().createdPreprint.data!.id;
    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));

    return this.licensesService.updatePreprintLicense(createdPreprintId, action.licenseId, action.licenseOptions).pipe(
      tap((preprint) => {
        ctx.setState(patch({ createdPreprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => this.handleError(ctx, 'createdPreprint', error))
    );
  }

  @Action(FetchPreprintsSubjects)
  fetchPreprintsSubjects(ctx: StateContext<SubmitPreprintStateModel>) {
    const createdPreprintId = ctx.getState().createdPreprint.data!.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ subjects: patch({ isLoading: true }) }));

    return this.subjectsService.getPreprintSubjects(createdPreprintId).pipe(
      tap((subjects) => {
        ctx.patchState({
          subjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'subjects', error))
    );
  }

  @Action(UpdatePreprintsSubjects)
  updatePreprintsSubjects(ctx: StateContext<SubmitPreprintStateModel>, { subjects }: UpdatePreprintsSubjects) {
    const createdPreprintId = ctx.getState().createdPreprint.data?.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ subjects: patch({ isLoading: true }) }));

    return this.subjectsService.updatePreprintSubjects(createdPreprintId, subjects).pipe(
      tap(() => {
        ctx.patchState({
          subjects: {
            data: subjects,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'subjects', error))
    );
  }

  @Action(DisconnectProject)
  disconnectProject(ctx: StateContext<SubmitPreprintStateModel>) {
    const createdPreprintId = ctx.getState().createdPreprint.data?.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));

    return this.preprintProjectsService.removePreprintProjectRelationship(createdPreprintId).pipe(
      tap(() => {
        ctx.patchState({
          createdPreprint: {
            ...ctx.getState().createdPreprint,
            data: {
              ...ctx.getState().createdPreprint.data!,
              nodeId: null,
            },
            isSubmitting: false,
          },
          preprintProject: {
            data: null,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'createdPreprint', error))
    );
  }

  @Action(ConnectProject)
  connectProject(ctx: StateContext<SubmitPreprintStateModel>, { projectId }: ConnectProject) {
    const createdPreprintId = ctx.getState().createdPreprint.data?.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));

    return this.preprintProjectsService.updatePreprintProjectRelationship(createdPreprintId, projectId).pipe(
      tap((preprint) => {
        ctx.patchState({
          createdPreprint: {
            data: preprint,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'createdPreprint', error))
    );
  }

  @Action(FetchPreprintProject)
  fetchPreprintProject(ctx: StateContext<SubmitPreprintStateModel>) {
    const preprintProjectId = ctx.getState().createdPreprint.data?.nodeId;
    if (!preprintProjectId) return EMPTY;

    ctx.setState(patch({ preprintProject: patch({ isLoading: true }) }));

    return this.preprintProjectsService.getProjectById(preprintProjectId).pipe(
      tap((project) => {
        ctx.patchState({
          preprintProject: {
            data: project,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprintProject', error))
    );
  }

  @Action(CreateNewProject)
  createNewProject(ctx: StateContext<SubmitPreprintStateModel>, action: CreateNewProject) {
    const createdPreprintId = ctx.getState().createdPreprint.data!.id;
    ctx.setState(patch({ createdPreprint: patch({ isSubmitting: true }) }));
    ctx.setState(patch({ preprintProject: patch({ isLoading: true }) }));

    return this.preprintProjectsService
      .createProject(action.title, action.description, action.templateFrom, action.regionId, action.affiliationsId)
      .pipe(
        switchMap((project) =>
          forkJoin([
            of(project),
            this.preprintProjectsService.updatePreprintProjectRelationship(createdPreprintId, project.id),
          ])
        ),
        tap(([project, preprint]) => {
          ctx.patchState({
            createdPreprint: {
              ...ctx.getState().createdPreprint,
              data: {
                ...ctx.getState().createdPreprint.data!,
                nodeId: preprint.nodeId,
              },
              isSubmitting: false,
            },
            preprintProject: {
              data: project,
              isLoading: false,
              error: null,
            },
          });
        }),
        catchError((error) => this.handleError(ctx, 'preprintProject', error))
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
