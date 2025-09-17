import { inject, InjectionToken } from '@angular/core';

import { ENVIRONMENT_DO_NO_USE } from '@core/constants/environment.token';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

/**
 * `ENVIRONMENT` is an Angular `InjectionToken` that provides a **runtime-mutable proxy**
 * over the application's static environment configuration.
 *
 * This factory wraps the base environment config (`ENVIRONMENT_DO_NO_USE`) in a `Proxy`
 * so values can be accessed and overridden at runtime while preserving type safety
 * based on the `EnvironmentModel` interface.
 *
 * ## Key Features:
 * - Provides type-safe access to environment variables (e.g. `apiDomainUrl`, `recaptchaSiteKey`)
 * - Supports **runtime modification** of values (e.g. `environment.featureFlag = true`)
 * - Works seamlessly with Angular dependency injection
 *
 * @example
 * ```ts
 * const env = inject(ENVIRONMENT);
 * console.log(env.apiDomainUrl);
 * env.apiDomainUrl = 'https://dev.example.com'; // Override at runtime
 * ```
 *
 * @see EnvironmentModel for a complete list of available keys.
 * @see ENVIRONMENT_DO_NO_USE for the static base config (not modifiable).
 */
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
