import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';
import { RegionsService } from '@osf/shared/services';

import { FetchRegions } from './regions.actions';
import { RegionsStateModel } from './regions.model';

@State<RegionsStateModel>({
  name: 'regions',
  defaults: {
    regions: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class RegionsState {
  private readonly regionsService = inject(RegionsService);

  @Action(FetchRegions)
  fetchSubjects(ctx: StateContext<RegionsStateModel>) {
    ctx.setState(patch({ regions: patch({ isLoading: true }) }));

    return this.regionsService.getAllRegions().pipe(
      tap((regions) => {
        ctx.setState(patch({ regions: patch({ isLoading: false, data: regions }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'regions', error))
    );
  }
}
