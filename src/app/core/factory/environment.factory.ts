import { inject, InjectionToken } from '@angular/core';

import { ENVIRONMENT_DO_NO_USE } from '@core/constants/environment.token';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

export const ENVIRONMENT = new InjectionToken<EnvironmentModel>('EnvironmentProxy', {
  providedIn: 'root',
  factory: () => {
    const environment = inject(ENVIRONMENT_DO_NO_USE);

    return new Proxy<EnvironmentModel>(
      { ...environment },
      {
        get: (target, prop: keyof EnvironmentModel) => target[prop],
        set: <K extends keyof EnvironmentModel>(target: EnvironmentModel, prop: K, value: EnvironmentModel[K]) => {
          target[prop] = value;
          return true;
        },
      }
    );
  },
});
