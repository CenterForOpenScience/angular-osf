/**
 * Angular InjectionToken providing access to the global environment configuration.
 *
 * This token exposes the values defined in the `environment.ts` file as an injectable object
 * implementing the `EnvironmentModel` interface.
 *
 * ⚠️ **Warning:** This token is marked `DO_NOT_USE` to discourage direct usage in services/components.
 * Prefer using the `ENVIRONMENT` proxy-based token (if available) to allow dynamic mutation in tests or runtime.
 *
 */

import { InjectionToken } from '@angular/core';

import { EnvironmentModel } from '@shared/models/environment.model';

import { environment } from 'src/environments/environment';

/**
 * Injection token representing the app's static environment configuration.
 *
 * Do not use this directly unless necessary. Prefer the proxy-based `ENVIRONMENT` token for safer access.
 */
export const ENVIRONMENT_DO_NO_USE = new InjectionToken<EnvironmentModel>('App Environment', {
  providedIn: 'root',

  /**
   * Factory function that returns the raw environment object cast to `EnvironmentModel`.
   * This is a one-time snapshot of the environment loaded at build time.
   */
  factory: () => environment as EnvironmentModel,
});
