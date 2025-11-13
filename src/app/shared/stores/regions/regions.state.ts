import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { RegionsService } from '@osf/shared/services/regions.service';

import { FetchRegions } from './regions.actions';
import { REGIONS_STATE_DEFAULTS, RegionsStateModel } from './regions.model';

@State<RegionsStateModel>({
  name: 'regions',
  defaults: REGIONS_STATE_DEFAULTS,
})
@Injectable()
export class RegionsState {
  private readonly regionsService = inject(RegionsService);

  @Action(FetchRegions)
  fetchRegions(ctx: StateContext<RegionsStateModel>) {
    ctx.setState(patch({ regions: patch({ isLoading: true }) }));

    return this.regionsService.getAllRegions().pipe(
      tap((regions) => {
        ctx.setState(patch({ regions: patch({ isLoading: false, data: regions }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'regions', error))
    );
  }
}
