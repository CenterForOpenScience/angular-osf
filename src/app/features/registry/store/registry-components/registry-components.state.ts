import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';

import { RegistryComponentsService } from '../../services/registry-components.service';

import { GetRegistryComponents } from './registry-components.actions';
import { REGISTRY_COMPONENTS_STATE_DEFAULTS, RegistryComponentsStateModel } from './registry-components.model';

@State<RegistryComponentsStateModel>({
  name: 'registryComponents',
  defaults: REGISTRY_COMPONENTS_STATE_DEFAULTS,
})
@Injectable()
export class RegistryComponentsState {
  private readonly registryComponentsService = inject(RegistryComponentsService);

  @Action(GetRegistryComponents)
  getRegistryComponents(ctx: StateContext<RegistryComponentsStateModel>, action: GetRegistryComponents) {
    const state = ctx.getState();
    ctx.patchState({
      registryComponents: { ...state.registryComponents, isLoading: true, error: null },
    });

    return this.registryComponentsService.getRegistryComponents(action.registryId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          registryComponents: {
            data: response.data,
            isLoading: false,
            error: null,
            totalCount: response.meta.total,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registryComponents', error))
    );
  }
}
