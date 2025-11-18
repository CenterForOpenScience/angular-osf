import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { RegistrationProviderService } from '@osf/shared/services/registration-provider.service';

import { ClearRegistryProvider, GetRegistryProvider } from './registration-provider.actions';
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

  @Action(GetRegistryProvider)
  getRegistryProvider(ctx: StateContext<RegistrationProviderStateModel>, action: GetRegistryProvider) {
    const state = ctx.getState();

    const currentProvider = state.currentBrandedProvider.data;

    if (currentProvider && currentProvider?.id === action.providerId) {
      ctx.dispatch(
        new SetCurrentProvider({
          id: currentProvider?.id,
          name: currentProvider?.name,
          type: CurrentResourceType.Registrations,
          permissions: currentProvider?.permissions,
          reviewsWorkflow: currentProvider?.reviewsWorkflow,
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

    return this.registrationProvidersService.getProviderBrand(action.providerId).pipe(
      tap((provider) => {
        ctx.patchState({
          currentBrandedProvider: {
            data: provider,
            isLoading: false,
            error: null,
          },
        });

        ctx.dispatch(
          new SetCurrentProvider({
            id: provider.id,
            name: provider.name,
            type: CurrentResourceType.Registrations,
            permissions: provider.permissions,
            reviewsWorkflow: provider.reviewsWorkflow,
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'currentBrandedProvider', error))
    );
  }

  @Action(ClearRegistryProvider)
  clearRegistryProvider(ctx: StateContext<RegistrationProviderStateModel>) {
    ctx.patchState({ ...REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS });
  }
}
