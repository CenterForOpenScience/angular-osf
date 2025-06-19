import { Action, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';

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
  ResetCustomItemMetadata,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateProjectDetails,
} from '@osf/features/project/metadata/store';

import { CedarMetadataRecord, CedarMetadataRecordData, CedarMetadataRecordJsonApi, CrossRefFunder } from '../models';

const initialState: MetadataStateModel = {
  project: null,
  projectLoading: false,
  customItemMetadata: null,
  customItemMetadataLoading: false,
  fundersList: [] as CrossRefFunder[],
  loading: false,
  fundersLoading: false,
  error: null,
  cedarTemplates: null,
  cedarTemplatesLoading: false,
  cedarRecord: null,
  cedarRecordLoading: false,
  cedarRecords: [] as CedarMetadataRecordData[],
  cedarRecordsLoading: false,
  userInstitutions: [],
  userInstitutionsLoading: false,
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
      loading: true,
      error: null,
    });

    return this.metadataService.getCustomItemMetadata(action.guid).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            customItemMetadata: response.data.attributes,
            loading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message || 'Failed to load metadata',
            loading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(UpdateCustomItemMetadata)
  updateCustomItemMetadata(ctx: StateContext<MetadataStateModel>, action: UpdateCustomItemMetadata) {
    ctx.patchState({
      loading: true,
      error: null,
    });

    return this.metadataService.updateCustomItemMetadata(action.guid, action.metadata).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            customItemMetadata: response.data.attributes,
            loading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message || 'Failed to update metadata',
            loading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(GetFundersList)
  getFundersList(ctx: StateContext<MetadataStateModel>, action: GetFundersList) {
    ctx.patchState({
      fundersLoading: true,
      error: null,
    });

    return this.metadataService.getFundersList(action.search).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            fundersList: response.message.items,
            fundersLoading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message,
            fundersLoading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ fundersLoading: false }))
    );
  }

  @Action(GetCedarMetadataTemplates)
  getCedarMetadataTemplates(ctx: StateContext<MetadataStateModel>, action: GetCedarMetadataTemplates) {
    ctx.patchState({
      cedarTemplatesLoading: true,
      error: null,
    });

    return this.metadataService.getMetadataCedarTemplates(action.url).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            cedarTemplates: response,
            cedarTemplatesLoading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message || 'Failed to load CEDAR templates',
            cedarTemplatesLoading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ cedarTemplatesLoading: false }))
    );
  }

  @Action(ResetCustomItemMetadata)
  resetCustomItemMetadata(ctx: StateContext<MetadataStateModel>) {
    ctx.setState({
      project: null,
      projectLoading: false,
      customItemMetadata: null,
      customItemMetadataLoading: false,
      fundersList: [],
      loading: false,
      fundersLoading: false,
      error: null,
      cedarTemplates: null,
      cedarTemplatesLoading: false,
      cedarRecord: null,
      cedarRecordLoading: false,
      cedarRecords: [],
      cedarRecordsLoading: false,
      userInstitutions: [],
      userInstitutionsLoading: false,
    });
  }

  @Action(GetCedarMetadataRecords)
  getCedarMetadataRecords(ctx: StateContext<MetadataStateModel>, action: GetCedarMetadataRecords) {
    ctx.patchState({ cedarRecordsLoading: true });
    return this.metadataService.getMetadataCedarRecords(action.projectId).pipe(
      tap((response: CedarMetadataRecordJsonApi) => {
        ctx.patchState({
          cedarRecords: response.data,
          cedarRecordsLoading: false,
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
        // Update the existing record in state
        const state = ctx.getState();
        const updatedRecords = state.cedarRecords.map((record) =>
          record.id === action.recordId ? response.data : record
        );
        ctx.patchState({
          cedarRecords: updatedRecords,
        });
      })
    );
  }

  @Action(AddCedarMetadataRecordToState)
  addCedarMetadataRecordToState(ctx: StateContext<MetadataStateModel>, action: AddCedarMetadataRecordToState) {
    ctx.setState(
      patch({
        cedarRecords: append([action.record]),
      })
    );
  }

  @Action(GetProjectForMetadata)
  getProjectForMetadata(ctx: StateContext<MetadataStateModel>, action: GetProjectForMetadata) {
    ctx.patchState({
      projectLoading: true,
      error: null,
    });

    return this.metadataService.getProjectForMetadata(action.projectId).pipe(
      tap({
        next: (project) => {
          ctx.patchState({
            project: project,
            projectLoading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message || 'Failed to load project',
            projectLoading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ projectLoading: false }))
    );
  }

  @Action(UpdateProjectDetails)
  updateProjectDetails(ctx: StateContext<MetadataStateModel>, action: UpdateProjectDetails) {
    ctx.patchState({
      projectLoading: true,
      error: null,
    });

    return this.metadataService.updateProjectDetails(action.projectId, action.updates).pipe(
      tap({
        next: (updatedProject) => {
          ctx.patchState({
            project: updatedProject,
            projectLoading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: (error as Error).message || 'Failed to update project details',
            projectLoading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ projectLoading: false }))
    );
  }
  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<MetadataStateModel>, action: GetUserInstitutions) {
    ctx.patchState({
      userInstitutionsLoading: true,
      error: null,
    });

    return this.metadataService.getUserInstitutions(action.userId, action.page, action.pageSize).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            userInstitutions: response.data,
            userInstitutionsLoading: false,
          });
        },
        error: (error) => {
          ctx.patchState({
            error: (error as Error).message || 'Failed to load user institutions',
            userInstitutionsLoading: false,
          });
        },
      }),
      finalize(() => ctx.patchState({ userInstitutionsLoading: false }))
    );
  }
}
