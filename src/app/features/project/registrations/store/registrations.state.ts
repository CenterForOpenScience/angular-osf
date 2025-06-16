import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { RegistrationsService } from '../services';

import { GetRegistrations } from './registrations.actions';
import { RegistrationsStateModel } from './registrations.model';

@State<RegistrationsStateModel>({
  name: 'registrations',
  defaults: {
    registrations: {
      data: [],
      isLoading: false,
      error: '',
    },
  },
})
@Injectable()
export class RegistrationsState {
  #registrationsService = inject(RegistrationsService);

  @Action(GetRegistrations)
  getRegistrations(ctx: StateContext<RegistrationsStateModel>, action: GetRegistrations) {
    const state = ctx.getState();

    ctx.patchState({
      registrations: { ...state.registrations, isLoading: true, error: null },
    });

    return this.#registrationsService.getRegistrations(action.projectId).pipe(
      tap((registrations) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          registrations: {
            data: registrations,
            isLoading: false,
            error: '',
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'registrations', error))
    );
  }

  private handleError(ctx: StateContext<RegistrationsStateModel>, section: 'registrations', error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
