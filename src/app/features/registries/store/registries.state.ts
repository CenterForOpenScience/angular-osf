import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';
import { ResourceTab } from '@osf/shared/enums';
import { SearchService } from '@osf/shared/services';
import { getResourceTypes } from '@osf/shared/utils';

import { RegistriesService } from '../services';

import { RegistrationContributorsHandlers } from './handlers/contributors.handlers';
import { LicensesHandlers } from './handlers/licenses.handlers';
import { ProjectsHandlers } from './handlers/projects.handlers';
import { ProvidersHandlers } from './handlers/providers.handlers';
import { SubjectsHandlers } from './handlers/subjects.handlers';
import { DefaultState } from './default.state';
import {
  AddContributor,
  CreateDraft,
  DeleteContributor,
  DeleteDraft,
  FetchContributors,
  FetchDraft,
  FetchLicenses,
  FetchRegistrationSubjects,
  FetchSchemaBlocks,
  GetProjects,
  GetProviders,
  GetRegistries,
  SaveLicense,
  UpdateContributor,
  UpdateRegistrationSubjects,
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
  subjectsHandler = inject(SubjectsHandlers);
  contributorsHandler = inject(RegistrationContributorsHandlers);

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

  @Action(GetProviders)
  getProviders(ctx: StateContext<RegistriesStateModel>) {
    return this.providersHandler.getProviders(ctx);
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

  @Action(FetchContributors)
  fetchContributors(ctx: StateContext<RegistriesStateModel>, action: FetchContributors) {
    return this.contributorsHandler.fetchContributors(ctx, action);
  }

  @Action(AddContributor)
  addContributor(ctx: StateContext<RegistriesStateModel>, action: AddContributor) {
    return this.contributorsHandler.addContributor(ctx, action);
  }

  @Action(UpdateContributor)
  updateContributor(ctx: StateContext<RegistriesStateModel>, action: UpdateContributor) {
    return this.contributorsHandler.updateContributor(ctx, action);
  }

  @Action(DeleteContributor)
  deleteContributor(ctx: StateContext<RegistriesStateModel>, action: DeleteContributor) {
    return this.contributorsHandler.deleteContributor(ctx, action);
  }

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<RegistriesStateModel>) {
    return this.licensesHandler.fetchLicenses(ctx);
  }

  @Action(SaveLicense)
  saveLicense(ctx: StateContext<RegistriesStateModel>, { registrationId, licenseId, licenseOptions }: SaveLicense) {
    return this.licensesHandler.saveLicense(ctx, { registrationId, licenseId, licenseOptions });
  }

  @Action(FetchRegistrationSubjects)
  fetchRegistrationSubjects(ctx: StateContext<RegistriesStateModel>, { registrationId }: FetchRegistrationSubjects) {
    return this.subjectsHandler.fetchRegistrationSubjects(ctx, { registrationId });
  }

  @Action(UpdateRegistrationSubjects)
  updateRegistrationSubjects(
    ctx: StateContext<RegistriesStateModel>,
    { registrationId, subjects }: UpdateRegistrationSubjects
  ) {
    return this.subjectsHandler.updateRegistrationSubjects(ctx, { registrationId, subjects });
  }
}
