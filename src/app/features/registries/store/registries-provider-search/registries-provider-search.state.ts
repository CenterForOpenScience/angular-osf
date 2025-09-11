import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';

import { ProvidersService } from '../../services';

import { GetRegistryProviderBrand } from './registries-provider-search.actions';
import {
  REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS,
  RegistriesProviderSearchStateModel,
} from './registries-provider-search.model';

@State<RegistriesProviderSearchStateModel>({
  name: 'registryProviderSearch',
  defaults: REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS,
})
@Injectable()
export class RegistriesProviderSearchState {
  private providersService = inject(ProvidersService);

  @Action(GetRegistryProviderBrand)
  getProviderBrand(ctx: StateContext<RegistriesProviderSearchStateModel>, action: GetRegistryProviderBrand) {
    const state = ctx.getState();
    ctx.patchState({
      currentBrandedProvider: {
        ...state.currentBrandedProvider,
        isLoading: true,
      },
    });

    return this.providersService.getProviderBrand(action.providerName).pipe(
      tap((brand) => {
        ctx.setState(
          patch({
            currentBrandedProvider: patch({
              data: brand,
              isLoading: false,
              error: null,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'currentBrandedProvider', error))
    );
  }
}
