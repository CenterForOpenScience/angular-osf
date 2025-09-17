import { inject, provideAppInitializer } from '@angular/core';

import { OSFConfigService } from '@core/services/osf-config.service';

import { ENVIRONMENT } from './environment.provider';

import * as Sentry from '@sentry/angular';
import { GoogleTagManagerConfiguration } from 'angular-google-tag-manager';

/**
 * Asynchronous initializer function that loads the Sentry DSN from the config service
 * and initializes Sentry at application bootstrap.
 *
 * This function is meant to be used with `provideAppInitializer`, which blocks Angular
 * bootstrap until the Promise resolves. This avoids race conditions when reading config.
 *
 * @returns A Promise that resolves once Sentry is initialized (or skipped if no DSN)
 */
export function initializeApplication() {
  return async () => {
    const configService = inject(OSFConfigService);
    const googleTagManagerConfiguration = inject(GoogleTagManagerConfiguration);
    const environment = inject(ENVIRONMENT);

    await configService.load();

    const googleTagManagerId = environment.googleTagManagerId;
    if (googleTagManagerId) {
      googleTagManagerConfiguration.set({ id: googleTagManagerId });
    }

    const dsn = environment.sentryDsn;
    if (dsn) {
      // More Options
      // https://docs.sentry.io/platforms/javascript/guides/angular/configuration/options/
      Sentry.init({
        dsn,
        environment: environment.production ? 'production' : 'development',
        maxBreadcrumbs: 50,
        sampleRate: 1.0, // error sample rate
        integrations: [],
      });
    }
  };
}

/**
 * Provides the Sentry initialization logic during Angular's application bootstrap phase.
 *
 * This uses `provideAppInitializer` to block application startup until Sentry is initialized.
 * It ensures that the Sentry DSN (fetched from OSFConfigService) is available and configured
 * before any errors are handled or reported by the app.
 *
 * `initializeSentry` is a function that returns a Promise which resolves after Sentry is fully initialized.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/angular/
 * @see Angular's `provideAppInitializer`: https://angular.io/api/core/provideAppInitializer
 */
export const APPLICATION_INITIALIZATION_PROVIDER = provideAppInitializer(initializeApplication());
