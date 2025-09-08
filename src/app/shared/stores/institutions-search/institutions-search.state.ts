import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { Institution } from '@osf/shared/models';
import { InstitutionsService } from '@osf/shared/services';

import { FetchInstitutionById } from './institutions-search.actions';
import { INSTITUTIONS_SEARCH_STATE_DEFAULTS, InstitutionsSearchModel } from './institutions-search.model';

@State<InstitutionsSearchModel>({
  name: 'institutionsSearch',
  defaults: INSTITUTIONS_SEARCH_STATE_DEFAULTS,
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
      catchError((error) => handleSectionError(ctx, 'institution', error))
    );
  }
}
