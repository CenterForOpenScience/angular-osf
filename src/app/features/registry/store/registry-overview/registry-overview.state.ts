import { Action, State, StateContext } from '@ngxs/store';

import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { RegistryOverviewService } from '@osf/features/registry/services';
import {
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistrySubjects,
  GetSchemaBlocks,
} from '@osf/features/registry/store/registry-overview';

import { RegistryOverviewStateModel } from './registry-overview.model';

@Injectable()
@State<RegistryOverviewStateModel>({
  name: 'registryOverview',
  defaults: {
    registry: {
      data: null,
      isLoading: false,
      error: null,
    },
    subjects: {
      data: [],
      isLoading: false,
      error: null,
    },
    institutions: {
      data: [],
      isLoading: false,
      error: null,
    },
    schemaBlocks: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
export class RegistryOverviewState {
  private readonly registryOverviewService = inject(RegistryOverviewService);

  @Action(GetRegistryById)
  getRegistryById(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistryById) {
    const state = ctx.getState();
    ctx.patchState({
      registry: {
        ...state.registry,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getRegistrationById(action.id).pipe(
      tap({
        next: (registryOverview) => {
          ctx.patchState({
            registry: {
              data: registryOverview,
              isLoading: false,
              error: null,
            },
          });
          if (registryOverview?.registrationSchemaLink && registryOverview?.questions) {
            ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink, registryOverview.questions));
          }
        },
      }),
      catchError((error) => this.handleError(ctx, 'registry', error))
    );
  }

  @Action(GetRegistrySubjects)
  getRegistrySubjects(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistrySubjects) {
    const state = ctx.getState();
    ctx.patchState({
      subjects: {
        ...state.subjects,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getSubjects(action.registryId).pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            subjects: {
              data: subjects,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'subjects', error))
    );
  }

  @Action(GetRegistryInstitutions)
  getRegistryInstitutions(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistryInstitutions) {
    const state = ctx.getState();
    ctx.patchState({
      institutions: {
        ...state.institutions,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getInstitutions(action.registryId).pipe(
      tap({
        next: (institutions) => {
          ctx.patchState({
            institutions: {
              data: institutions,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'institutions', error))
    );
  }

  @Action(GetSchemaBlocks)
  getSchemaBlocks(ctx: StateContext<RegistryOverviewStateModel>, action: GetSchemaBlocks) {
    const state = ctx.getState();
    ctx.patchState({
      schemaBlocks: {
        ...state.schemaBlocks,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getSchemaBlocks(action.schemaLink).pipe(
      tap({
        next: (schemaBlocks) => {
          ctx.patchState({
            schemaBlocks: {
              data: schemaBlocks,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => this.handleError(ctx, 'schemaBlocks', error))
    );
  }

  private handleError(
    ctx: StateContext<RegistryOverviewStateModel>,
    section: 'registry' | 'subjects' | 'institutions' | 'schemaBlocks',
    error: Error
  ) {
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
