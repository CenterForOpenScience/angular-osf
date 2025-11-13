import { Action, State, StateContext } from '@ngxs/store';

import { catchError, finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';

import { CedarMetadataRecord, CedarMetadataRecordJsonApi, MetadataModel } from '../models';
import { MetadataService } from '../services';

import {
  AddCedarMetadataRecordToState,
  CreateCedarMetadataRecord,
  CreateDoi,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetFundersList,
  GetResourceMetadata,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateResourceDetails,
  UpdateResourceLicense,
} from './metadata.actions';
import { METADATA_STATE_DEFAULTS, MetadataStateModel } from './metadata.model';

@State<MetadataStateModel>({
  name: 'metadata',
  defaults: METADATA_STATE_DEFAULTS,
})
@Injectable()
export class MetadataState {
  private readonly metadataService = inject(MetadataService);

  @Action(GetResourceMetadata)
  getResourceMetadata(ctx: StateContext<MetadataStateModel>, action: GetResourceMetadata) {
    const state = ctx.getState();
    ctx.patchState({
      metadata: {
        ...state.metadata,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.getResourceMetadata(action.resourceId, action.resourceType).pipe(
      tap((resource) => {
        ctx.patchState({
          metadata: {
            data: resource as MetadataModel,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'metadata', error))
    );
  }

  @Action(GetCustomItemMetadata)
  getCustomItemMetadata(ctx: StateContext<MetadataStateModel>, action: GetCustomItemMetadata) {
    const state = ctx.getState();

    ctx.patchState({
      customMetadata: { ...state.customMetadata, isLoading: true, error: null },
    });

    return this.metadataService.getCustomItemMetadata(action.guid).pipe(
      tap((response) => {
        ctx.patchState({
          customMetadata: { data: response, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'customMetadata', error))
    );
  }

  @Action(UpdateCustomItemMetadata)
  updateCustomItemMetadata(ctx: StateContext<MetadataStateModel>, action: UpdateCustomItemMetadata) {
    const state = ctx.getState();

    ctx.patchState({
      customMetadata: { ...state.customMetadata, isLoading: true, error: null },
    });

    return this.metadataService.updateCustomItemMetadata(action.guid, action.metadata).pipe(
      tap((response) => {
        ctx.patchState({
          customMetadata: { data: response, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'customMetadata', error))
    );
  }

  @Action(CreateDoi)
  createDoi(ctx: StateContext<MetadataStateModel>, action: CreateDoi) {
    ctx.patchState({
      metadata: { ...ctx.getState().metadata, isLoading: true, error: null },
    });

    return this.metadataService.createDoi(action.resourceId, action.resourceType).pipe(
      tap(() => {
        ctx.patchState({
          metadata: { ...ctx.getState().metadata, isLoading: false, error: null },
        });
        ctx.dispatch(new GetResourceMetadata(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'metadata', error))
    );
  }

  @Action(GetFundersList)
  getFundersList(ctx: StateContext<MetadataStateModel>, action: GetFundersList) {
    ctx.patchState({
      fundersList: { ...ctx.getState().fundersList, isLoading: true, error: null },
    });

    return this.metadataService.getFundersList(action.search).pipe(
      tap((response) => {
        ctx.patchState({
          fundersList: { data: response.message.items, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'fundersList', error))
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
    return this.metadataService.getMetadataCedarRecords(action.resourceId, action.resourceType, action.url).pipe(
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
    return this.metadataService.createMetadataCedarRecord(action.record, action.resourceId, action.resourceType).pipe(
      tap((response: CedarMetadataRecord) => {
        ctx.patchState({
          cedarRecord: {
            data: response,
            error: null,
            isLoading: false,
          },
        });
        ctx.dispatch(new AddCedarMetadataRecordToState(response.data));
      })
    );
  }

  @Action(UpdateCedarMetadataRecord)
  updateCedarMetadataRecord(ctx: StateContext<MetadataStateModel>, action: UpdateCedarMetadataRecord) {
    return this.metadataService
      .updateMetadataCedarRecord(action.record, action.recordId, action.resourceId, action.resourceType)
      .pipe(
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

  @Action(UpdateResourceDetails)
  updateResourceDetails(ctx: StateContext<MetadataStateModel>, action: UpdateResourceDetails) {
    ctx.patchState({
      metadata: {
        ...ctx.getState().metadata,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService.updateResourceDetails(action.resourceId, action.resourceType, action.updates).pipe(
      tap((updatedResource) => {
        const currentResource = ctx.getState().metadata.data;

        ctx.patchState({
          metadata: {
            data: {
              ...currentResource,
              ...updatedResource,
            },
            error: null,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'metadata', error))
    );
  }

  @Action(UpdateResourceLicense)
  updateResourceLiceUpdateResourceLicense(ctx: StateContext<MetadataStateModel>, action: UpdateResourceLicense) {
    ctx.patchState({
      metadata: {
        ...ctx.getState().metadata,
        isLoading: true,
        error: null,
      },
    });

    return this.metadataService
      .updateResourceLicense(action.resourceId, action.resourceType, action.licenseId, action.licenseOptions)
      .pipe(
        tap((updatedResource) => {
          const currentResource = ctx.getState().metadata.data;

          ctx.patchState({
            metadata: {
              data: {
                ...currentResource,
                ...updatedResource,
              },
              error: null,
              isLoading: false,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'metadata', error))
      );
  }
}
