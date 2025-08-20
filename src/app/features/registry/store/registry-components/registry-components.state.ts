import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';

import { RegistryComponentsService } from '../../services/registry-components.service';

import { GetRegistryComponents } from './registry-components.actions';
import { RegistryComponentsStateModel } from './registry-components.model';

const initialState: RegistryComponentsStateModel = {
  registryComponents: { data: [], isLoading: false, error: null, totalCount: 0 },
};

@State<RegistryComponentsStateModel>({
  name: 'registryComponents',
  defaults: initialState,
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
