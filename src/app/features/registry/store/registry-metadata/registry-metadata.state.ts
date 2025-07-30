import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { CedarMetadataRecord, CedarMetadataRecordJsonApi } from '@osf/features/project/metadata/models';
import { ResourceType } from '@shared/enums';
import { GetAllContributors } from '@shared/stores';

import { RegistryMetadataMapper } from '../../mappers';
import { CustomItemMetadataRecord } from '../../models';
import { RegistryMetadataService } from '../../services/registry-metadata.service';

import {
  AddCedarMetadataRecordToState,
  AddRegistryContributor,
  CreateCedarMetadataRecord,
  GetBibliographicContributors,
  GetCedarMetadataTemplates,
  GetCustomItemMetadata,
  GetLicenseFromUrl,
  GetRegistryCedarMetadataRecords,
  GetRegistryForMetadata,
  GetRegistryInstitutions,
  GetRegistrySubjects,
  GetUserInstitutions,
  UpdateCedarMetadataRecord,
  UpdateCustomItemMetadata,
  UpdateRegistryContributor,
  UpdateRegistryDetails,
  UpdateRegistryInstitutions,
  UpdateRegistrySubjects,
} from './registry-metadata.actions';
import { RegistryMetadataStateModel } from './registry-metadata.model';

const initialState: RegistryMetadataStateModel = {
  registry: { data: null, isLoading: false, error: null },
  bibliographicContributors: { data: [], isLoading: false, error: null },
  customItemMetadata: { data: {}, isLoading: false, error: null },
  userInstitutions: { data: [], isLoading: false, error: null },
  institutions: { data: [], isLoading: false, error: null },
  subjects: { data: [], isLoading: false, error: null },
  cedarTemplates: { data: null, isLoading: false, error: null },
  cedarRecord: { data: null, isLoading: false, error: null },
  cedarRecords: { data: [], isLoading: false, error: null },
  license: { data: null, isLoading: false, error: null },
};

@State<RegistryMetadataStateModel>({
  name: 'registryMetadata',
  defaults: initialState,
})
@Injectable()
export class RegistryMetadataState {
  private readonly registryMetadataService = inject(RegistryMetadataService);

  @Action(GetRegistryForMetadata)
  getRegistryForMetadata(ctx: StateContext<RegistryMetadataStateModel>, action: GetRegistryForMetadata) {
    ctx.patchState({
      registry: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getRegistryForMetadata(action.registryId).pipe(
      tap((registry) => {
        ctx.patchState({
          registry: {
            data: registry,
            isLoading: false,
            error: null,
          },
        });

        if (registry.licenseUrl) {
          ctx.dispatch(new GetLicenseFromUrl(registry.licenseUrl));
        }
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(GetBibliographicContributors)
  getBibliographicContributors(ctx: StateContext<RegistryMetadataStateModel>, action: GetBibliographicContributors) {
    ctx.patchState({
      bibliographicContributors: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService
      .getBibliographicContributors(action.registryId, action.page, action.pageSize)
      .pipe(
        tap((response) => {
          const contributors = RegistryMetadataMapper.mapBibliographicContributors(response);
          ctx.patchState({
            bibliographicContributors: {
              data: contributors,
              isLoading: false,
              error: null,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'bibliographicContributors', error))
      );
  }

  @Action(GetRegistrySubjects)
  getRegistrySubjects(ctx: StateContext<RegistryMetadataStateModel>, action: GetRegistrySubjects) {
    ctx.patchState({
      subjects: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getRegistrySubjects(action.registryId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          subjects: {
            data: response.data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'subjects', error))
    );
  }

  @Action(GetRegistryInstitutions)
  getRegistryInstitutions(ctx: StateContext<RegistryMetadataStateModel>, action: GetRegistryInstitutions) {
    ctx.patchState({
      institutions: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getRegistryInstitutions(action.registryId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          institutions: {
            data: response.data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'institutions', error))
    );
  }

  @Action(GetCustomItemMetadata)
  getCustomItemMetadata(ctx: StateContext<RegistryMetadataStateModel>, action: GetCustomItemMetadata) {
    ctx.patchState({
      customItemMetadata: { data: {}, isLoading: true, error: null },
    });

    return this.registryMetadataService.getCustomItemMetadata(action.guid).pipe(
      tap((response) => {
        const metadataAttributes = response?.data?.attributes || (response as unknown as CustomItemMetadataRecord);

        ctx.patchState({
          customItemMetadata: { data: metadataAttributes, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'customItemMetadata', error))
    );
  }

  @Action(UpdateCustomItemMetadata)
  updateCustomItemMetadata(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateCustomItemMetadata) {
    ctx.patchState({
      customItemMetadata: { data: {} as CustomItemMetadataRecord, isLoading: true, error: null },
    });

    return this.registryMetadataService.updateCustomItemMetadata(action.guid, action.metadata).pipe(
      tap((response) => {
        const metadataAttributes = response?.data?.attributes || (response as unknown as CustomItemMetadataRecord);
        ctx.patchState({
          customItemMetadata: {
            data: { ...ctx.getState().customItemMetadata.data, ...metadataAttributes },
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'customItemMetadata', error))
    );
  }

  @Action(UpdateRegistryDetails)
  updateRegistryDetails(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateRegistryDetails) {
    ctx.patchState({
      registry: {
        ...ctx.getState().registry,
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.updateRegistryDetails(action.registryId, action.updates).pipe(
      tap((updatedRegistry) => {
        const currentRegistry = ctx.getState().registry.data;

        ctx.patchState({
          registry: {
            data: {
              ...currentRegistry,
              ...updatedRegistry,
            },
            error: null,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<RegistryMetadataStateModel>, action: GetUserInstitutions) {
    ctx.patchState({
      userInstitutions: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getUserInstitutions(action.userId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          userInstitutions: {
            data: response.data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'userInstitutions', error))
    );
  }

  @Action(GetCedarMetadataTemplates)
  getCedarMetadataTemplates(ctx: StateContext<RegistryMetadataStateModel>, action: GetCedarMetadataTemplates) {
    ctx.patchState({
      cedarTemplates: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getCedarMetadataTemplates(action.url).pipe(
      tap((response) => {
        ctx.patchState({
          cedarTemplates: {
            data: response,
            error: null,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'cedarTemplates', error))
    );
  }

  @Action(GetRegistryCedarMetadataRecords)
  getRegistryCedarMetadataRecords(
    ctx: StateContext<RegistryMetadataStateModel>,
    action: GetRegistryCedarMetadataRecords
  ) {
    ctx.patchState({
      cedarRecords: {
        data: [],
        isLoading: true,
        error: null,
      },
    });
    return this.registryMetadataService.getRegistryCedarMetadataRecords(action.registryId).pipe(
      tap((response: CedarMetadataRecordJsonApi) => {
        ctx.patchState({
          cedarRecords: {
            data: response.data,
            error: null,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'cedarRecords', error))
    );
  }

  @Action(CreateCedarMetadataRecord)
  createCedarMetadataRecord(ctx: StateContext<RegistryMetadataStateModel>, action: CreateCedarMetadataRecord) {
    return this.registryMetadataService.createCedarMetadataRecord(action.record).pipe(
      tap((response: CedarMetadataRecord) => {
        ctx.dispatch(new AddCedarMetadataRecordToState(response.data));
      })
    );
  }

  @Action(UpdateCedarMetadataRecord)
  updateCedarMetadataRecord(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateCedarMetadataRecord) {
    return this.registryMetadataService.updateCedarMetadataRecord(action.record, action.recordId).pipe(
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
  addCedarMetadataRecordToState(ctx: StateContext<RegistryMetadataStateModel>, action: AddCedarMetadataRecordToState) {
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

  @Action(UpdateRegistrySubjects)
  updateRegistrySubjects(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateRegistrySubjects) {
    return this.registryMetadataService.updateRegistrySubjects(action.registryId, action.subjects);
  }

  @Action(UpdateRegistryInstitutions)
  updateRegistryInstitutions(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateRegistryInstitutions) {
    return this.registryMetadataService.updateRegistryInstitutions(action.registryId, action.institutions).pipe(
      tap(() => {
        ctx.dispatch(new GetRegistryInstitutions(action.registryId));
      })
    );
  }

  @Action(UpdateRegistryContributor)
  updateRegistryContributor(ctx: StateContext<RegistryMetadataStateModel>, action: UpdateRegistryContributor) {
    const updateRequest = {
      data: action.updateData,
    };

    return this.registryMetadataService
      .updateRegistryContributor(action.registryId, action.contributorId, updateRequest)
      .pipe(
        tap(() => {
          ctx.dispatch(new GetBibliographicContributors(action.registryId));
          ctx.dispatch(new GetAllContributors(action.registryId, ResourceType.Registration));
          ctx.dispatch(new GetRegistryForMetadata(action.registryId));
        })
      );
  }

  @Action(AddRegistryContributor)
  addRegistryContributor(ctx: StateContext<RegistryMetadataStateModel>, action: AddRegistryContributor) {
    const addRequest = {
      data: action.contributorData,
    };

    return this.registryMetadataService.addRegistryContributor(action.registryId, addRequest).pipe(
      tap(() => {
        ctx.dispatch(new GetBibliographicContributors(action.registryId));
        ctx.dispatch(new GetAllContributors(action.registryId, ResourceType.Registration));
        ctx.dispatch(new GetRegistryForMetadata(action.registryId));
      })
    );
  }

  @Action(GetLicenseFromUrl)
  getLicenseFromUrl(ctx: StateContext<RegistryMetadataStateModel>, action: GetLicenseFromUrl) {
    ctx.patchState({
      license: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.registryMetadataService.getLicenseFromUrl(action.licenseUrl).pipe(
      tap((license) => {
        ctx.patchState({
          license: {
            data: license,
            isLoading: false,
            error: null,
          },
        });

        const currentRegistry = ctx.getState().registry.data;
        if (currentRegistry) {
          ctx.patchState({
            registry: {
              ...ctx.getState().registry,
              data: {
                ...currentRegistry,
                license: license,
              },
            },
          });
        }
      }),
      catchError((error) => handleSectionError(ctx, 'license', error))
    );
  }
}
