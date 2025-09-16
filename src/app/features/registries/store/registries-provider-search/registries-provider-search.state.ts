import { Action, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
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
  private store = inject(Store);

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
      tap((provider) => {
        ctx.setState(
          patch({
            currentBrandedProvider: patch({
              data: provider,
              isLoading: false,
              error: null,
            }),
          })
        );

        this.store.dispatch(new SetCurrentProvider(provider));
      }),
      catchError((error) => handleSectionError(ctx, 'currentBrandedProvider', error))
    );
  }
}
