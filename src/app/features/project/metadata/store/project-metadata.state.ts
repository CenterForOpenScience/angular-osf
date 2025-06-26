import { Action, State, StateContext } from '@ngxs/store';

import { finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MetadataService } from '@osf/features/project/metadata/services/metadata.service';
import {
  AddCedarMetadataRecordToState,
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetFundersList,
  GetProjectForMetadata,
  GetUserInstitutions,
  MetadataStateModel,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateProjectDetails,
} from '@osf/features/project/metadata/store';

import { CedarMetadataRecord, CedarMetadataRecordJsonApi } from '../models';

const initialState: MetadataStateModel = {
  project: { data: null, isLoading: false, error: null },
  customItemMetadata: { data: null, isLoading: false, error: null },
  fundersList: { data: [], isLoading: false, error: null },
  cedarTemplates: { data: null, isLoading: false, error: null },
  cedarRecord: { data: null, isLoading: false, error: null },
  cedarRecords: { data: [], isLoading: false, error: null },
  userInstitutions: { data: [], isLoading: false, error: null },
};

@State<MetadataStateModel>({
  name: 'metadata',
  defaults: initialState,
})
@Injectable()
export class ProjectMetadataState {
  private readonly metadataService = inject(MetadataService);

  @Action(GetCustomItemMetadata)
  getCustomItemMetadata(ctx: StateContext<MetadataStateModel>, action: GetCustomItemMetadata) {
    ctx.patchState({
      customItemMetadata: { data: null, isLoading: true, error: null },
    });

    return this.metadataService.getCustomItemMetadata(action.guid).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            customItemMetadata: { data: response.data.attributes, isLoading: false, error: null },
          });
        },
        error: (error) => {
          ctx.patchState({
            customItemMetadata: { data: null, isLoading: false, error: error.message },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          customItemMetadata: {
            ...ctx.getState().customItemMetadata,
            isLoading: false,
          },
        })
      )
    );
  }

  @Action(UpdateCustomItemMetadata)
  updateCustomItemMetadata(ctx: StateContext<MetadataStateModel>, action: UpdateCustomItemMetadata) {
    ctx.patchState({
      customItemMetadata: { data: null, isLoading: true, error: null },
    });

    return this.metadataService.updateCustomItemMetadata(action.guid, action.metadata).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            customItemMetadata: { data: response.data.attributes, isLoading: true, error: null },
          });
        },
        error: (error) => {
          ctx.patchState({
            customItemMetadata: { ...ctx.getState().customItemMetadata, isLoading: false, error: error.message },
          });
        },
      }),
      finalize(() => ctx.patchState({ customItemMetadata: { ...ctx.getState().customItemMetadata, isLoading: false } }))
    );
  }

  @Action(GetFundersList)
  getFundersList(ctx: StateContext<MetadataStateModel>, action: GetFundersList) {
    ctx.patchState({
      fundersList: { data: [], isLoading: true, error: null },
    });

    return this.metadataService.getFundersList(action.search).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            fundersList: { data: response.message.items, isLoading: false, error: null },
          });
        },
        error: (error) => {
          ctx.patchState({
            fundersList: {
              ...ctx.getState().fundersList,
              isLoading: false,
              error: error.message,
            },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          fundersList: {
            ...ctx.getState().fundersList,
            isLoading: false,
          },
        })
      )
    );
  }

  @Action(GetCedarMetadataTemplates)
  getCedarMetadataTemplates(ctx: StateContext<MetadataStateModel>, action: GetCedarMetadataTemplates) {
    ctx.patchState({
      cedarTemplates: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.getMetadataCedarTemplates(action.url).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            cedarTemplates: {
              data: response,
              error: null,
              isLoading: false,
            },
          });
        },
        error: (error) => {
          ctx.patchState({
            cedarTemplates: {
              ...ctx.getState().cedarTemplates,
              error: error.message,
              isLoading: false,
            },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          cedarTemplates: {
            ...ctx.getState().cedarTemplates,
            isLoading: false,
          },
        })
      )
    );
  }

  @Action(GetCedarMetadataRecords)
  getCedarMetadataRecords(ctx: StateContext<MetadataStateModel>, action: GetCedarMetadataRecords) {
    ctx.patchState({
      cedarRecords: {
        data: [],
        isLoading: false,
        error: null,
      },
    });
    return this.metadataService.getMetadataCedarRecords(action.projectId).pipe(
      tap((response: CedarMetadataRecordJsonApi) => {
        ctx.patchState({
          cedarRecords: {
            data: response.data,
            error: null,
            isLoading: false,
          },
        });
      })
    );
  }

  @Action(CreateCedarMetadataRecord)
  createCedarMetadataRecord(ctx: StateContext<MetadataStateModel>, action: CreateCedarMetadataRecord) {
    return this.metadataService.createMetadataCedarRecord(action.record).pipe(
      tap((response: CedarMetadataRecord) => {
        ctx.dispatch(new AddCedarMetadataRecordToState(response.data));
      })
    );
  }

  @Action(UpdateCedarMetadataRecord)
  updateCedarMetadataRecord(ctx: StateContext<MetadataStateModel>, action: UpdateCedarMetadataRecord) {
    return this.metadataService.updateMetadataCedarRecord(action.record, action.recordId).pipe(
      tap((response: CedarMetadataRecord) => {
        const state = ctx.getState();
        const updatedRecords = state.cedarRecords.data.map((record) =>
          record.id === action.recordId ? response.data : record
        );
        ctx.patchState({
          cedarRecords: {
            data: updatedRecords,
            isLoading: false,
            error: null,
          },
        });
      })
    );
  }

  @Action(AddCedarMetadataRecordToState)
  addCedarMetadataRecordToState(ctx: StateContext<MetadataStateModel>, action: AddCedarMetadataRecordToState) {
    const state = ctx.getState();
    const updatedCedarRecords = [...state.cedarRecords.data, action.record];

    ctx.setState({
      ...state,
      cedarRecords: {
        data: updatedCedarRecords,
        error: null,
        isLoading: false,
      },
    });
  }

  @Action(GetProjectForMetadata)
  getProjectForMetadata(ctx: StateContext<MetadataStateModel>, action: GetProjectForMetadata) {
    ctx.patchState({
      project: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.getProjectForMetadata(action.projectId).pipe(
      tap({
        next: (project) => {
          ctx.patchState({
            project: {
              data: project,
              isLoading: false,
              error: null,
            },
          });
        },
        error: (error) => {
          ctx.patchState({
            project: {
              data: ctx.getState().project.data,
              error: error.message,
              isLoading: false,
            },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          project: {
            data: ctx.getState().project.data,
            error: null,
            isLoading: false,
          },
        })
      )
    );
  }

  @Action(UpdateProjectDetails)
  updateProjectDetails(ctx: StateContext<MetadataStateModel>, action: UpdateProjectDetails) {
    ctx.patchState({
      project: {
        ...ctx.getState().project,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.updateProjectDetails(action.projectId, action.updates).pipe(
      tap({
        next: (updatedProject) => {
          const currentProject = ctx.getState().project.data;

          ctx.patchState({
            project: {
              data: {
                ...currentProject,
                ...updatedProject,
              },
              error: null,
              isLoading: false,
            },
          });
        },
        error: (error) => {
          ctx.patchState({
            project: {
              ...ctx.getState().project,
              error: error.message,
              isLoading: false,
            },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          project: {
            ...ctx.getState().project,
            error: null,
            isLoading: false,
          },
        })
      )
    );
  }
  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<MetadataStateModel>, action: GetUserInstitutions) {
    ctx.patchState({
      userInstitutions: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.getUserInstitutions(action.userId, action.page, action.pageSize).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            userInstitutions: {
              data: response.data,
              isLoading: false,
              error: null,
            },
          });
        },
        error: (error) => {
          ctx.patchState({
            userInstitutions: {
              ...ctx.getState().userInstitutions,
              error: error.message,
              isLoading: false,
            },
          });
        },
      }),
      finalize(() =>
        ctx.patchState({
          userInstitutions: {
            ...ctx.getState().userInstitutions,
            error: null,
            isLoading: false,
          },
        })
      )
    );
  }
}
