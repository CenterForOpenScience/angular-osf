import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';
import { ResourceTab } from '@osf/shared/enums';
import { SearchService } from '@osf/shared/services';
import { getResourceTypes } from '@osf/shared/utils';

import { RegistriesService } from '../services';

import { LicensesHandlers } from './handlers/licenses.handlers';
import { ProjectsHandlers } from './handlers/projects.handlers';
import { ProvidersHandlers } from './handlers/providers.handlers';
import { DefaultState } from './default.state';
import {
  ClearState,
  CreateDraft,
  DeleteDraft,
  FetchDraft,
  FetchDraftRegistrations,
  FetchLicenses,
  FetchProjectChildren,
  FetchSchemaBlocks,
  FetchSubmittedRegistrations,
  GetProjects,
  GetProviderSchemas,
  GetRegistries,
  RegisterDraft,
  SaveLicense,
  UpdateDraft,
  UpdateStepValidation,
} from './registries.actions';
import { RegistriesStateModel } from './registries.model';

@State<RegistriesStateModel>({
  name: 'registries',
  defaults: { ...DefaultState },
})
@Injectable()
export class RegistriesState {
  searchService = inject(SearchService);
  registriesService = inject(RegistriesService);

  providersHandler = inject(ProvidersHandlers);
  projectsHandler = inject(ProjectsHandlers);
  licensesHandler = inject(LicensesHandlers);

  @Action(GetRegistries)
  getRegistries(ctx: StateContext<RegistriesStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      registries: {
        ...state.registries,
        isLoading: true,
      },
    });

    const resourceType = getResourceTypes(ResourceTab.Registrations);

    return this.searchService.getResources({}, '', '', resourceType).pipe(
      tap((registries) => {
        ctx.patchState({
          registries: {
            data: registries.resources,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registries', error))
    );
  }

  @Action(GetProjects)
  getProjects(ctx: StateContext<RegistriesStateModel>) {
    return this.projectsHandler.getProjects(ctx);
  }

  @Action(FetchProjectChildren)
  fetchProjectChildren(ctx: StateContext<RegistriesStateModel>, { projectId }: FetchProjectChildren) {
    return this.projectsHandler.fetchProjectChildren(ctx, projectId);
  }

  @Action(GetProviderSchemas)
  getProviders(ctx: StateContext<RegistriesStateModel>, { providerId }: GetProviderSchemas) {
    return this.providersHandler.getProviderSchemas(ctx, providerId);
  }

  @Action(CreateDraft)
  createDraft(ctx: StateContext<RegistriesStateModel>, { payload }: CreateDraft) {
    ctx.patchState({
      draftRegistration: {
        ...ctx.getState().draftRegistration,
        isSubmitting: true,
      },
    });

    return this.registriesService.createDraft(payload.registrationSchemaId, payload.projectId).pipe(
      tap((registration) => {
        ctx.patchState({
          draftRegistration: {
            data: { ...registration },
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          draftRegistration: {
            ...ctx.getState().draftRegistration,
            isSubmitting: false,
            error: error.message,
          },
        });
        return handleSectionError(ctx, 'draftRegistration', error);
      })
    );
  }

  @Action(FetchDraft)
  fetchDraft(ctx: StateContext<RegistriesStateModel>, { draftId }: FetchDraft) {
    ctx.patchState({
      draftRegistration: {
        ...ctx.getState().draftRegistration,
        isLoading: true,
        error: null,
      },
    });

    return this.registriesService.getDraft(draftId).pipe(
      tap((draft) => {
        ctx.patchState({
          draftRegistration: {
            data: { ...draft },
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'draftRegistration', error))
    );
  }

  @Action(DeleteDraft)
  deleteDraft(ctx: StateContext<RegistriesStateModel>, { draftId }: DeleteDraft) {
    ctx.patchState({
      draftRegistration: {
        ...ctx.getState().draftRegistration,
        isSubmitting: true,
      },
    });

    return this.registriesService.deleteDraft(draftId).pipe(
      tap(() => {
        ctx.patchState({
          draftRegistration: {
            ...ctx.getState().draftRegistration,
            isSubmitting: false,
            data: null,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'draftRegistration', error))
    );
  }

  @Action(UpdateDraft)
  updateDraft(ctx: StateContext<RegistriesStateModel>, { draftId, attributes, relationships }: UpdateDraft) {
    ctx.patchState({
      draftRegistration: {
        ...ctx.getState().draftRegistration,
        isSubmitting: true,
      },
    });

    return this.registriesService.updateDraft(draftId, attributes, relationships).pipe(
      tap((updatedDraft) => {
        ctx.patchState({
          draftRegistration: {
            data: { ...updatedDraft },
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'draftRegistration', error))
    );
  }

  @Action(RegisterDraft)
  registerDraft(
    ctx: StateContext<RegistriesStateModel>,
    { draftId, embargoDate, providerId, projectId, components }: RegisterDraft
  ) {
    ctx.patchState({
      registration: {
        ...ctx.getState().registration,
        isSubmitting: true,
      },
    });

    return this.registriesService.registerDraft(draftId, embargoDate, providerId, projectId, components).pipe(
      tap((registration) => {
        ctx.patchState({
          registration: {
            data: { ...registration },
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'draftRegistration', error))
    );
  }

  @Action(FetchSchemaBlocks)
  fetchSchemaBlocks(ctx: StateContext<RegistriesStateModel>, action: FetchSchemaBlocks) {
    const state = ctx.getState();
    ctx.patchState({
      pagesSchema: { ...state.pagesSchema, isLoading: true, error: null },
    });
    return this.registriesService.getSchemaBlocks(action.registrationSchemaId).pipe(
      tap((schemaBlocks) => {
        ctx.patchState({
          pagesSchema: {
            data: schemaBlocks,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'pagesSchema', error))
    );
  }

  @Action(UpdateStepValidation)
  updateStepValidation(ctx: StateContext<RegistriesStateModel>, { step, invalid }: UpdateStepValidation) {
    const state = ctx.getState();
    ctx.patchState({
      stepsValidation: {
        ...state.stepsValidation,
        [step]: { invalid },
      },
    });
  }

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<RegistriesStateModel>, { providerId }: FetchLicenses) {
    return this.licensesHandler.fetchLicenses(ctx, providerId);
  }

  @Action(SaveLicense)
  saveLicense(ctx: StateContext<RegistriesStateModel>, { registrationId, licenseId, licenseOptions }: SaveLicense) {
    return this.licensesHandler.saveLicense(ctx, { registrationId, licenseId, licenseOptions });
  }

  @Action(FetchDraftRegistrations)
  fetchDraftRegistrations(ctx: StateContext<RegistriesStateModel>, { page, pageSize }: FetchDraftRegistrations) {
    const state = ctx.getState();
    ctx.patchState({
      draftRegistrations: {
        ...state.draftRegistrations,
        isLoading: true,
        error: null,
      },
    });

    return this.registriesService.getDraftRegistrations(page, pageSize).pipe(
      tap((draftRegistrations) => {
        ctx.patchState({
          draftRegistrations: {
            data: draftRegistrations.data,
            totalCount: draftRegistrations.totalCount,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'draftRegistrations', error))
    );
  }

  @Action(FetchSubmittedRegistrations)
  fetchSubmittedRegistrations(
    ctx: StateContext<RegistriesStateModel>,
    { page, pageSize }: FetchSubmittedRegistrations
  ) {
    const state = ctx.getState();
    ctx.patchState({
      submittedRegistrations: { ...state.submittedRegistrations, isLoading: true, error: null },
    });

    return this.registriesService.getSubmittedRegistrations(page, pageSize).pipe(
      tap((submittedRegistrations) => {
        ctx.patchState({
          submittedRegistrations: {
            data: submittedRegistrations.data,
            totalCount: submittedRegistrations.totalCount,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'submittedRegistrations', error))
    );
  }

  @Action(ClearState)
  clearState(ctx: StateContext<RegistriesStateModel>) {
    ctx.setState({ ...DefaultState });
  }
}
