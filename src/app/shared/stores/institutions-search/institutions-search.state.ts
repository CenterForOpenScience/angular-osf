import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Institution } from '@osf/shared/models';
import { InstitutionsService } from '@osf/shared/services';

import { FetchInstitutionById } from './institutions-search.actions';
import { InstitutionsSearchModel } from './institutions-search.model';

@State<InstitutionsSearchModel>({
  name: 'institutionsSearch',
  defaults: {
    institution: { data: {} as Institution, isLoading: false, error: null },
  },
})
@Injectable()
export class InstitutionsSearchState {
  private readonly institutionsService = inject(InstitutionsService);

  @Action(FetchInstitutionById)
  fetchInstitutionById(ctx: StateContext<InstitutionsSearchModel>, action: FetchInstitutionById) {
    ctx.patchState({ institution: { data: {} as Institution, isLoading: true, error: null } });

    return this.institutionsService.getInstitutionById(action.institutionId).pipe(
      tap((response) => {
        ctx.setState(
          patch({
            institution: patch({ data: response, error: null, isLoading: false }),
          })
        );
      }),
      catchError((error) => {
        ctx.patchState({ institution: { ...ctx.getState().institution, isLoading: false, error } });
        return throwError(() => error);
      })
    );
  }
}
