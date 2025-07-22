import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { RegistryResourcesService } from '@osf/features/registry/services/registry-resources.service';
import { GetRegistryResources, RegistryResourcesStateModel } from '@osf/features/registry/store/registry-resources';

@Injectable()
@State<RegistryResourcesStateModel>({
  name: 'registryResources',
  defaults: {
    resources: {
      data: null,
      isLoading: false,
      error: null,
    },
  },
})
export class RegistryResourcesState {
  private readonly registryResourcesService = inject(RegistryResourcesService);

  @Action(GetRegistryResources)
  getRegistryResources(ctx: StateContext<RegistryResourcesStateModel>, action: GetRegistryResources) {
    const state = ctx.getState();
    ctx.patchState({
      resources: {
        ...state.resources,
        isLoading: true,
      },
    });

    return this.registryResourcesService.getResources(action.registryId).pipe(
      tap({
        next: (resources) => {
          ctx.patchState({
            resources: {
              data: resources,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }
}
