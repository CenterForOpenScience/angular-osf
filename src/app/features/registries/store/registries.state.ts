import { Action, State, StateContext } from '@ngxs/store';

import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ResourceTab } from '@shared/enums';
import { SearchService } from '@shared/services';
import { getResourceTypes } from '@shared/utils';

import { GetRegistries } from './registries.actions';
import { RegistriesStateModel } from './registries.model';

@Injectable()
@State<RegistriesStateModel>({
  name: 'registries',
  defaults: {
    registries: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
export class RegistriesState {
  searchService = inject(SearchService);

  @Action(GetRegistries)
  getRegistries(ctx: StateContext<RegistriesStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      registries: {
        ...state.registries,
        isLoading: true,
      },
    });

    const resourceType = getResourceTypes(ResourceTab.Registrations);

    return this.searchService.getResources({}, '', '', resourceType).pipe(
      tap((registries) => {
        ctx.patchState({
          registries: {
            data: registries.resources,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'registries', error))
    );
  }

  private handleError(ctx: StateContext<RegistriesStateModel>, section: 'registries', error: Error) {
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
