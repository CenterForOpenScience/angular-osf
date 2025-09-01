import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, Observable, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { InstitutionsService } from '@osf/shared/services';
import { handleSectionError } from '@shared/helpers';

import {
  FetchInstitutions,
  FetchResourceInstitutions,
  FetchUserInstitutions,
  UpdateResourceInstitutions,
} from './institutions.actions';
import { INSTITUTIONS_STATE_DEFAULTS, InstitutionsStateModel } from './institutions.model';

@State<InstitutionsStateModel>({
  name: 'institutions',
  defaults: INSTITUTIONS_STATE_DEFAULTS,
})
@Injectable()
export class InstitutionsState {
  private readonly institutionsService = inject(InstitutionsService);

  @Action(FetchUserInstitutions)
  getUserInstitutions(ctx: StateContext<InstitutionsStateModel>) {
    ctx.setState(patch({ userInstitutions: patch({ isLoading: true }) }));

    return this.institutionsService.getUserInstitutions().pipe(
      tap((institutions) => {
        ctx.setState(
          patch({
            userInstitutions: patch({
              isLoading: false,
              data: institutions,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'userInstitutions', error))
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

  @Action(FetchResourceInstitutions)
  fetchResourceInstitutions(ctx: StateContext<InstitutionsStateModel>, action: FetchResourceInstitutions) {
    ctx.setState(patch({ resourceInstitutions: patch({ isLoading: true }) }));

    return this.institutionsService.getResourceInstitutions(action.resourceId, action.resourceType).pipe(
      tap((institutions) => {
        ctx.setState(
          patch({
            resourceInstitutions: patch({
              data: institutions,
              isLoading: false,
              error: null,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'resourceInstitutions', error))
    );
  }

  @Action(UpdateResourceInstitutions)
  updateResourceInstitutions(
    ctx: StateContext<InstitutionsStateModel>,
    action: UpdateResourceInstitutions
  ): Observable<void> {
    ctx.setState(patch({ resourceInstitutions: patch({ isSubmitting: true }) }));

    return this.institutionsService
      .updateResourceInstitutions(action.resourceId, action.resourceType, action.institutions)
      .pipe(
        tap(() => {
          ctx.setState(
            patch({
              resourceInstitutions: patch({
                data: action.institutions,
                isSubmitting: false,
              }),
            })
          );
        }),
        catchError((error) => handleSectionError(ctx, 'resourceInstitutions', error))
      );
  }
}
