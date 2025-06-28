import { Action, State, StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ResourceTab } from '@osf/shared/enums';
import { SearchService } from '@osf/shared/services';
import { getResourceTypes } from '@osf/shared/utils';

import { Project } from '../models';
import { LicensesService, ProjectsService, ProvidersService, RegistriesService } from '../services';

import {
  AddContributor,
  CreateDraft,
  DeleteContributor,
  DeleteDraft,
  FetchContributors,
  FetchDraft,
  FetchLicenses,
  FetchSchemaBlocks,
  GetProjects,
  GetProviders,
  GetRegistries,
  UpdateContributor,
} from './registries.actions';
import { RegistriesStateModel } from './registries.model';

const DefaultState: RegistriesStateModel = {
  providers: {
    data: [],
    isLoading: false,
    error: null,
  },
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  draftRegistration: {
    isLoading: false,
    data: null,
    isSubmitting: false,
    error: null,
  },
  contributorsList: {
    data: [],
    isLoading: false,
    error: null,
  },
  registries: {
    data: [],
    isLoading: false,
    error: null,
  },
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  pagesSchema: {
    data: [],
    isLoading: false,
    error: null,
  },
};

@State<RegistriesStateModel>({
  name: 'registries',
  defaults: { ...DefaultState },
})
@Injectable()
export class RegistriesState {
  searchService = inject(SearchService);
  providersService = inject(ProvidersService);
  projectsService = inject(ProjectsService);
  registriesService = inject(RegistriesService);
  licensesService = inject(LicensesService);

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
      catchError((error) => this.handleError(ctx, 'registries', error))
    );
  }

  @Action(GetProjects)
  getProjects({ patchState }: StateContext<RegistriesStateModel>) {
    patchState({
      projects: {
        ...DefaultState.projects,
        isLoading: true,
      },
    });
    return this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        patchState({
          projects: {
            data: projects,
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        patchState({
          projects: { ...DefaultState.projects, isLoading: false, error },
        });
      },
    });
  }

  @Action(GetProviders)
  getProviders({ patchState }: StateContext<RegistriesStateModel>) {
    patchState({
      providers: {
        ...DefaultState.providers,
        isLoading: true,
      },
    });
    return this.providersService.getProviders().subscribe({
      next: (providers) => {
        patchState({
          providers: {
            data: providers,

            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        patchState({
          providers: {
            ...DefaultState.providers,
            isLoading: false,
            error,
          },
        });
      },
    });
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
        return this.handleError(ctx, 'draftRegistration', error);
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
      catchError((error) => this.handleError(ctx, 'draftRegistration', error))
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
      catchError((error) => this.handleError(ctx, 'draftRegistration', error))
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
      catchError((error) => this.handleError(ctx, 'pagesSchema', error))
    );
  }

  @Action(FetchContributors)
  fetchContributors(ctx: StateContext<RegistriesStateModel>, action: FetchContributors) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.registriesService.getContributors(action.draftId).pipe(
      tap((contributors) => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: contributors,
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(AddContributor)
  addContributor(ctx: StateContext<RegistriesStateModel>, action: AddContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.registriesService.addContributor(action.draftId, action.contributor).pipe(
      tap((contributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: [...currentState.contributorsList.data, contributor],
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(UpdateContributor)
  updateContributor(ctx: StateContext<RegistriesStateModel>, action: UpdateContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.registriesService.updateContributor(action.draftId, action.contributor).pipe(
      tap((updatedContributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: currentState.contributorsList.data.map((contributor) =>
              contributor.id === updatedContributor.id ? updatedContributor : contributor
            ),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(DeleteContributor)
  deleteContributor(ctx: StateContext<RegistriesStateModel>, action: DeleteContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.registriesService.deleteContributor(action.draftId, action.contributorId).pipe(
      tap(() => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: state.contributorsList.data.filter((contributor) => contributor.userId !== action.contributorId),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<RegistriesStateModel>) {
    ctx.patchState({
      licenses: {
        ...ctx.getState().licenses,
        isLoading: true,
      },
    });

    return this.licensesService.getLicenses().pipe(
      tap((licenses) => {
        ctx.patchState({
          licenses: {
            data: licenses,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'licenses', error))
    );
  }

  private handleError(ctx: StateContext<RegistriesStateModel>, section: keyof RegistriesStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
