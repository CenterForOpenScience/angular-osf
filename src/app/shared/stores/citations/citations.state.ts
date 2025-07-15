import { Action, State, StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { CitationsService } from '@shared/services/citations.service';

import { GetDefaultCitations } from './citations.actions';
import { CitationsStateModel } from './citations.model';

const CITATIONS_DEFAULTS: CitationsStateModel = {
  defaultCitations: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<CitationsStateModel>({
  name: 'citations',
  defaults: CITATIONS_DEFAULTS,
})
@Injectable()
export class CitationsState {
  citationsService = inject(CitationsService);

  @Action(GetDefaultCitations)
  getDefaultCitation(ctx: StateContext<CitationsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      defaultCitations: {
        ...state.defaultCitations,
        isLoading: true,
      },
    });

    // TODO
  }
}
