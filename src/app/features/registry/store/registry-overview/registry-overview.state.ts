import { Action, State, StateContext } from '@ngxs/store';

import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { RegistryOverviewService } from '@osf/features/registry/services';
import { GetRegistryById } from '@osf/features/registry/store/registry-overview/registry-overview.actions';

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
        },
      }),
      catchError((error) => this.handleError(ctx, 'registry', error))
    );
  }

  private handleError(ctx: StateContext<RegistryOverviewStateModel>, section: 'registry', error: Error) {
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
