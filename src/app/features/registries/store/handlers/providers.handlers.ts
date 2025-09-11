import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { ProvidersService } from '../../services';
import { REGISTRIES_STATE_DEFAULTS, RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProvidersHandlers {
  providersService = inject(ProvidersService);

  getProviderSchemas({ patchState }: StateContext<RegistriesStateModel>, providerId: string) {
    patchState({
      providerSchemas: {
        ...REGISTRIES_STATE_DEFAULTS.providerSchemas,
        isLoading: true,
      },
    });
    return this.providersService.getProviderSchemas(providerId).subscribe({
      next: (providers) => {
        patchState({
          providerSchemas: {
            data: providers,
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        patchState({
          providerSchemas: {
            ...REGISTRIES_STATE_DEFAULTS.providerSchemas,
            isLoading: false,
            error,
          },
        });
      },
    });
  }
}
