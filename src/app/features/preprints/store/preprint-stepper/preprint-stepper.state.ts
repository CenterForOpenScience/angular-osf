import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { EMPTY, filter, forkJoin, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { PreprintModel } from '@osf/features/preprints/models';
import {
  PreprintFilesService,
  PreprintLicensesService,
  PreprintsProjectsService,
  PreprintsService,
} from '@osf/features/preprints/services';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FilesService } from '@osf/shared/services/files.service';

import {
  ConnectProject,
  CopyFileFromProject,
  CreateNewProject,
  CreateNewVersion,
  CreatePreprint,
  DeletePreprint,
  DisconnectProject,
  FetchAvailableProjects,
  FetchLicenses,
  FetchPreprintById,
  FetchPreprintFilesLinks,
  FetchPreprintPrimaryFile,
  FetchPreprintProject,
  FetchProjectFilesByLink,
  PreprintStepperStateModel,
  ResetState,
  ReuploadFile,
  SaveLicense,
  SetCurrentFolder,
  SetInstitutionsChanged,
  SetProjectRootFolder,
  SetSelectedPreprintFileSource,
  SetSelectedPreprintProviderId,
  SubmitPreprint,
  UpdatePreprint,
  UpdatePrimaryFileRelationship,
  UploadFile,
} from './';

const DefaultState: PreprintStepperStateModel = {
  selectedProviderId: null,
  preprint: {
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
  preprintFile: {
    data: null,
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
  preprintProject: {
    data: null,
    isLoading: false,
    error: null,
  },
  hasBeenSubmitted: false,
  currentFolder: {
    data: null,
    isLoading: false,
    error: null,
  },
  institutionsChanged: false,
};

@State<PreprintStepperStateModel>({
  name: 'preprintStepper',
  defaults: { ...DefaultState },
})
@Injectable()
export class PreprintStepperState {
  private preprintsService = inject(PreprintsService);
  private preprintFilesService = inject(PreprintFilesService);
  private fileService = inject(FilesService);
  private licensesService = inject(PreprintLicensesService);
  private preprintProjectsService = inject(PreprintsProjectsService);

  @Action(SetSelectedPreprintProviderId)
  setSelectedPreprintProviderId(ctx: StateContext<PreprintStepperStateModel>, action: SetSelectedPreprintProviderId) {
    ctx.patchState({
      selectedProviderId: action.id,
    });
  }

  @Action(CreatePreprint)
  createPreprint(ctx: StateContext<PreprintStepperStateModel>, action: CreatePreprint) {
    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintsService.createPreprint(action.title, action.abstract, action.providerId).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(UpdatePreprint)
  updatePreprint(ctx: StateContext<PreprintStepperStateModel>, action: UpdatePreprint) {
    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintsService.updatePreprint(action.id, action.payload).pipe(
      tap((preprint) => {
        if (action.payload.isPublished) {
          ctx.setState(patch({ hasBeenSubmitted: true }));
        }

        ctx.setState(patch({ preprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(FetchPreprintById)
  getPreprintById(ctx: StateContext<PreprintStepperStateModel>, action: FetchPreprintById) {
    ctx.setState(patch({ preprint: patch({ isLoading: true }) }));

    return this.preprintsService.getById(action.id).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isLoading: false, data: preprint }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(FetchPreprintFilesLinks)
  getPreprintFilesLinks(ctx: StateContext<PreprintStepperStateModel>) {
    const state = ctx.getState();
    if (!state.preprint.data) {
      return EMPTY;
    }
    ctx.setState(patch({ preprintFilesLinks: patch({ isLoading: true }) }));

    return this.preprintFilesService.getPreprintFilesLinks(state.preprint.data.id).pipe(
      tap((preprintStorage) => {
        ctx.setState(patch({ preprintFilesLinks: patch({ isLoading: false, data: preprintStorage }) }));
      })
    );
  }

  @Action(UploadFile)
  uploadFile(ctx: StateContext<PreprintStepperStateModel>, action: UploadFile) {
    const state = ctx.getState();
    if (!state.preprintFilesLinks.data?.uploadFileLink) {
      return EMPTY;
    }

    ctx.setState(patch({ preprintFile: patch({ isLoading: true }) }));

    return this.fileService.uploadFile(action.file, state.preprintFilesLinks.data.uploadFileLink).pipe(
      filter((event) => event.type === HttpEventType.Response),
      switchMap((event) => {
        const file = event.body!.data;
        const createdFileId = file.id.split('/')[1];

        return ctx.dispatch(new UpdatePrimaryFileRelationship(createdFileId));
      })
    );
  }

  @Action(UpdatePrimaryFileRelationship)
  updatePrimaryFileRelationship(ctx: StateContext<PreprintStepperStateModel>, action: UpdatePrimaryFileRelationship) {
    const state = ctx.getState();

    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintFilesService.updateFileRelationship(state.preprint.data!.id, action.fileId).pipe(
      tap((preprint: PreprintModel) => {
        ctx.patchState({
          preprint: {
            ...ctx.getState().preprint,
            data: {
              ...ctx.getState().preprint.data!,
              primaryFileId: preprint.primaryFileId,
            },
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(ReuploadFile)
  reuploadFile(ctx: StateContext<PreprintStepperStateModel>, action: ReuploadFile) {
    const state = ctx.getState();
    const uploadedFile = state.preprintFile.data;
    if (!uploadedFile) return EMPTY;

    ctx.setState(patch({ preprintFile: patch({ isLoading: true }) }));

    return this.fileService
      .updateFileContent(action.file, uploadedFile.links.upload)
      .pipe(switchMap(() => this.fileService.renameEntry(uploadedFile.links.upload, action.file.name, 'replace')));
  }

  @Action(FetchPreprintPrimaryFile)
  fetchPreprintPrimaryFile(ctx: StateContext<PreprintStepperStateModel>) {
    const state = ctx.getState();
    const primaryFileId = state.preprint.data?.primaryFileId;
    if (!primaryFileId) return EMPTY;

    ctx.setState(patch({ preprintFile: patch({ isLoading: true }) }));

    return this.fileService.getFileById(primaryFileId).pipe(
      tap((file: FileModel) => {
        ctx.setState(
          patch({
            preprintFile: patch({
              data: file,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintFile', error))
    );
  }

  @Action(FetchAvailableProjects)
  getAvailableProjects(ctx: StateContext<PreprintStepperStateModel>, action: FetchAvailableProjects) {
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
      catchError((error) => handleSectionError(ctx, 'availableProjects', error))
    );
  }

  @Action(SetProjectRootFolder)
  setProjectRootFolder(ctx: StateContext<PreprintStepperStateModel>, action: SetProjectRootFolder) {
    ctx.setState(
      patch({
        currentFolder: patch({
          isLoading: true,
        }),
      })
    );
    return this.preprintFilesService.getProjectRootFolder(action.projectId).pipe(
      tap((folder: FileFolderModel) => {
        ctx.setState(
          patch({
            currentFolder: patch({
              data: folder,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => {
        ctx.setState(
          patch({
            currentFolder: patch({
              data: null,
              isLoading: false,
            }),
          })
        );
        return handleSectionError(ctx, 'currentFolder', error);
      })
    );
  }

  @Action(FetchProjectFilesByLink)
  getProjectFilesByLink(ctx: StateContext<PreprintStepperStateModel>, action: FetchProjectFilesByLink) {
    ctx.setState(patch({ projectFiles: patch({ isLoading: true }) }));

    return this.fileService.getFilesWithoutFiltering(action.filesLink).pipe(
      tap((files: FileModel[]) => {
        ctx.setState(
          patch({
            projectFiles: patch({
              data: files,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'projectFiles', error))
    );
  }

  @Action(SetSelectedPreprintFileSource)
  setSelectedPreprintFileSource(ctx: StateContext<PreprintStepperStateModel>, action: SetSelectedPreprintFileSource) {
    ctx.patchState({
      fileSource: action.fileSource,
    });
  }

  @Action(CopyFileFromProject)
  copyFileFromProject(ctx: StateContext<PreprintStepperStateModel>, action: CopyFileFromProject) {
    const createdPreprintId = ctx.getState().preprint.data?.id;
    if (!createdPreprintId) {
      return;
    }

    ctx.setState(patch({ preprintFile: patch({ isLoading: true }) }));
    return this.fileService
      .copyFileToAnotherLocation(action.file.links.move, action.file.provider, createdPreprintId)
      .pipe(
        switchMap((file: FileModel) => {
          const fileIdAfterCopy = file.id.split('/')[1];

          return this.preprintFilesService.updateFileRelationship(createdPreprintId, fileIdAfterCopy).pipe(
            tap((preprint: PreprintModel) => {
              ctx.patchState({
                preprint: {
                  ...ctx.getState().preprint,
                  data: {
                    ...ctx.getState().preprint.data!,
                    primaryFileId: preprint.primaryFileId,
                  },
                },
              });
            }),
            catchError((error) => handleSectionError(ctx, 'preprint', error))
          );
        }),
        catchError((error) => handleSectionError(ctx, 'preprintFile', error))
      );
  }

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<PreprintStepperStateModel>) {
    const providerId = ctx.getState().selectedProviderId;
    if (!providerId) return;
    ctx.setState(patch({ licenses: patch({ isLoading: true }) }));

    return this.licensesService.getLicenses(providerId).pipe(
      tap((licenses) => {
        ctx.setState(patch({ licenses: patch({ isLoading: false, data: licenses }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'licenses', error))
    );
  }

  @Action(SaveLicense)
  saveLicense(ctx: StateContext<PreprintStepperStateModel>, action: SaveLicense) {
    const createdPreprintId = ctx.getState().preprint.data!.id;
    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.licensesService.updatePreprintLicense(createdPreprintId, action.licenseId, action.licenseOptions).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isSubmitting: false, data: preprint }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(DisconnectProject)
  disconnectProject(ctx: StateContext<PreprintStepperStateModel>) {
    const createdPreprintId = ctx.getState().preprint.data?.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintProjectsService.removePreprintProjectRelationship(createdPreprintId).pipe(
      tap(() => {
        ctx.patchState({
          preprint: {
            ...ctx.getState().preprint,
            data: {
              ...ctx.getState().preprint.data!,
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
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(ConnectProject)
  connectProject(ctx: StateContext<PreprintStepperStateModel>, { projectId }: ConnectProject) {
    const createdPreprintId = ctx.getState().preprint.data?.id;
    if (!createdPreprintId) return EMPTY;

    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintProjectsService.updatePreprintProjectRelationship(createdPreprintId, projectId).pipe(
      tap((preprint) => {
        ctx.patchState({
          preprint: {
            data: preprint,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(FetchPreprintProject)
  fetchPreprintProject(ctx: StateContext<PreprintStepperStateModel>) {
    const preprintProjectId = ctx.getState().preprint.data?.nodeId;
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
  createNewProject(ctx: StateContext<PreprintStepperStateModel>, action: CreateNewProject) {
    const createdPreprintId = ctx.getState().preprint.data!.id;
    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));
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
            preprint: {
              ...ctx.getState().preprint,
              data: {
                ...ctx.getState().preprint.data!,
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
        catchError((error) => handleSectionError(ctx, 'preprintProject', error))
      );
  }

  @Action(SubmitPreprint)
  submitPreprint(ctx: StateContext<PreprintStepperStateModel>) {
    const createdPreprintId = ctx.getState().preprint.data!.id;
    ctx.setState(patch({ preprint: patch({ isSubmitting: true }) }));

    return this.preprintsService.submitPreprint(createdPreprintId).pipe(
      tap(() => {
        ctx.setState(patch({ preprint: patch({ isSubmitting: false }), hasBeenSubmitted: true }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(CreateNewVersion)
  createNewVersion(ctx: StateContext<PreprintStepperStateModel>, { preprintId }: CreateNewVersion) {
    ctx.setState(patch({ preprint: patch({ isLoading: true }) }));

    return this.preprintsService.createNewVersion(preprintId).pipe(
      tap((preprintNewVersion) => {
        ctx.setState(patch({ preprint: patch({ data: preprintNewVersion, isLoading: false }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(ResetState)
  resetState(ctx: StateContext<PreprintStepperStateModel>) {
    ctx.setState({ ...DefaultState });
    return EMPTY;
  }

  @Action(DeletePreprint)
  deletePreprint(ctx: StateContext<PreprintStepperStateModel>) {
    const state = ctx.getState();
    const createdPreprintId = state.preprint.data?.id;
    if (createdPreprintId && !state.hasBeenSubmitted) {
      return this.preprintsService.deletePreprint(createdPreprintId);
    }
    return EMPTY;
  }

  @Action(SetCurrentFolder)
  setCurrentFolder(ctx: StateContext<PreprintStepperStateModel>, action: SetCurrentFolder) {
    ctx.setState(
      patch({
        currentFolder: patch({
          data: action.folder,
        }),
      })
    );
  }

  @Action(SetInstitutionsChanged)
  setInstitutionsChanged(ctx: StateContext<PreprintStepperStateModel>, action: SetInstitutionsChanged) {
    ctx.patchState({ institutionsChanged: action.institutionsChanged });
  }
}
