import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { SetCurrentProvider } from './provider.actions';
import { PROVIDER_STATE_INITIAL, ProviderStateModel } from './provider.model';

@State<ProviderStateModel>({
  name: 'provider',
  defaults: PROVIDER_STATE_INITIAL,
})
@Injectable()
export class ProviderState {
  @Action(SetCurrentProvider)
  setCurrentProvider(ctx: StateContext<ProviderStateModel>, action: SetCurrentProvider) {
    ctx.patchState({
      currentProvider: action.provider,
    });
  }
}
