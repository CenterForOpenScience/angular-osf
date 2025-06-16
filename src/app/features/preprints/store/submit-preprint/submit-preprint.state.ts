import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { SetSelectedPreprintProviderId, SubmitPreprintStateModel } from './';

@State<SubmitPreprintStateModel>({
  name: 'submitPreprint',
})
@Injectable()
export class SubmitPreprintState {
  @Action(SetSelectedPreprintProviderId)
  setSelectedPreprintProviderId(ctx: StateContext<SubmitPreprintStateModel>, action: SetSelectedPreprintProviderId) {
    ctx.patchState({
      selectedProviderId: action.id,
    });
  }
}
