import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { ProvidersService } from '../../services';
import { DefaultState } from '../default.state';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProvidersHandlers {
  providersService = inject(ProvidersService);

  getProviders({ patchState }: StateContext<RegistriesStateModel>) {
    patchState({
      providers: {
        ...DefaultState.providers,
        isLoading: true,
      },
    });
    return this.providersService.getProviders().subscribe({
      next: (providers) => {
        patchState({
          providers: {
            data: providers,
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        patchState({
          providers: {
            ...DefaultState.providers,
            isLoading: false,
            error,
          },
        });
      },
    });
  }
}
