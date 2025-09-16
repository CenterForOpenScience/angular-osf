import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
import { CurrentResourceType } from '@osf/shared/enums';
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

  @Action(GetRegistryProviderBrand)
  getProviderBrand(ctx: StateContext<RegistrationProviderStateModel>, action: GetRegistryProviderBrand) {
    const state = ctx.getState();

    const currentProvider = state.currentBrandedProvider.data;

    if (currentProvider?.name === action.providerName) {
      ctx.dispatch(
        new SetCurrentProvider({
          id: currentProvider.id,
          name: currentProvider.name,
          type: CurrentResourceType.Registrations,
          permissions: currentProvider.permissions,
        })
      );

      return of(currentProvider);
    }

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

        ctx.dispatch(
          new SetCurrentProvider({
            id: provider.id,
            name: provider.name,
            type: CurrentResourceType.Registrations,
            permissions: provider.permissions,
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'currentBrandedProvider', error))
    );
  }
}
