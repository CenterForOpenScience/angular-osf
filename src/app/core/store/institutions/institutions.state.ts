import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { InstitutionsStateModel } from './institutions.model';
import { GetUserInstitutions } from './institutions.actions';
import { InstitutionsService } from '@osf/features/institutions/institutions.service';
import { tap } from 'rxjs';

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
      }),
    );
  }
}
