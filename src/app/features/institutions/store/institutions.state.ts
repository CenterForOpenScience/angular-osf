import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { InstitutionsService } from '../services';

import { GetUserInstitutions } from './institutions.actions';
import { InstitutionsStateModel } from './institutions.model';

@State<InstitutionsStateModel>({
  name: 'institutions',
  defaults: {
    userInstitutions: [],
  },
})
@Injectable()
export class InstitutionsState {
  #institutionsService = inject(InstitutionsService);

  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<InstitutionsStateModel>) {
    return this.#institutionsService.getUserInstitutions().pipe(
      tap((institutions) => {
        ctx.patchState({
          userInstitutions: institutions,
        });
      })
    );
  }
}
