import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { RegistrationsService } from '../services';

import { GetRegistrations } from './registrations.actions';
import { RegistrationsStateModel } from './registrations.model';

@State<RegistrationsStateModel>({
  name: 'registrations',
  defaults: {
    registrations: {
      data: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    },
  },
})
@Injectable()
export class RegistrationsState {
  private readonly registrationsService = inject(RegistrationsService);

  @Action(GetRegistrations)
  getRegistrations(ctx: StateContext<RegistrationsStateModel>, action: GetRegistrations) {
    const state = ctx.getState();

    ctx.patchState({
      registrations: { ...state.registrations, isLoading: true, error: null },
    });

    return this.registrationsService.getRegistrations(action.projectId).pipe(
      tap((registrations) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          registrations: {
            data: registrations.data,
            isLoading: false,
            error: null,
            totalCount: registrations.totalCount,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registrations', error))
    );
  }
}
