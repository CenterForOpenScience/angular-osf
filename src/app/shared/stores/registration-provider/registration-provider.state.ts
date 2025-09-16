import { Action, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
import { handleSectionError } from '@shared/helpers';

import { RegistrationProviderService } from '../../services';

import { GetRegistryProviderBrand } from './registration-provider.actions';
import {
  RegistrationProviderStateModel as RegistrationProviderStateModel,
  REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS,
} from './registration-provider.model';

@State<RegistrationProviderStateModel>({
  name: 'registryProviderSearch',
  defaults: REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS,
})
@Injectable()
export class RegistrationProviderState {
  private registrationProvidersService = inject(RegistrationProviderService);
  private store = inject(Store);

  @Action(GetRegistryProviderBrand)
  getProviderBrand(ctx: StateContext<RegistrationProviderStateModel>, action: GetRegistryProviderBrand) {
    const state = ctx.getState();
    ctx.patchState({
      currentBrandedProvider: {
        ...state.currentBrandedProvider,
        isLoading: true,
      },
    });

    return this.registrationProvidersService.getProviderBrand(action.providerName).pipe(
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
