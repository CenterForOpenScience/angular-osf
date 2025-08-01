import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { InstitutionsService } from '@osf/shared/services';

import { FetchInstitutions, FetchUserInstitutions } from './institutions.actions';
import { InstitutionsStateModel } from './institutions.model';

@State<InstitutionsStateModel>({
  name: 'institutions',
  defaults: {
    userInstitutions: [],
    institutions: {
      data: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    },
  },
})
@Injectable()
export class InstitutionsState {
  private readonly institutionsService = inject(InstitutionsService);

  @Action(FetchUserInstitutions)
  getUserInstitutions(ctx: StateContext<InstitutionsStateModel>) {
    return this.institutionsService.getUserInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({
          userInstitutions: institutions,
        });
      })
    );
  }

  @Action(FetchInstitutions)
  fetchInstitutions(ctx: StateContext<InstitutionsStateModel>, action: FetchInstitutions) {
    ctx.patchState({
      institutions: {
        data: [],
        totalCount: 0,
        isLoading: true,
        error: null,
      },
    });

    return this.institutionsService.getInstitutions(action.pageNumber, action.pageSize, action.searchValue).pipe(
      tap((response) => {
        ctx.setState(
          patch({
            institutions: patch({
              data: response.data,
              totalCount: response.total,
              error: null,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => {
        ctx.patchState({
          institutions: {
            ...ctx.getState().institutions,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
    );
  }
}
