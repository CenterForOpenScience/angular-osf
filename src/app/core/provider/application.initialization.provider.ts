import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';

import { SENTRY_DENY_URLS, SENTRY_IGNORE_ERRORS, sentryBeforeSend } from '@core/helpers/sentry-filter.helper';
import { OSFConfigService } from '@core/services/osf-config.service';

import { ENVIRONMENT } from './environment.provider';

import * as Sentry from '@sentry/angular';
import { GoogleTagManagerConfiguration } from 'angular-google-tag-manager';

/**
 * App initializer factory used with `provideAppInitializer`.
 *
 * Loads runtime config via `OSFConfigService`, then on the browser configures
 * Google Tag Manager, Sentry, and New Relic when their config values are present.
 * Bootstrap waits until this Promise resolves so config is available before startup.
 *
 * @returns An async initializer that resolves after config load and optional browser setup
 */
export function initializeApplication() {
  return async () => {
    const platformId = inject(PLATFORM_ID);
    const configService = inject(OSFConfigService);
    const googleTagManagerConfiguration = inject(GoogleTagManagerConfiguration);
    const environment = inject(ENVIRONMENT);

    await configService.load();

    if (!isPlatformBrowser(platformId)) {
      return;
    }

    if (environment.googleTagManagerId) {
      googleTagManagerConfiguration.set({ id: environment.googleTagManagerId });
    }

    if (environment.sentryDsn) {
      Sentry.init({
        dsn: environment.sentryDsn,
        environment: environment.sentryEnvironment,
        maxBreadcrumbs: 50,
        sampleRate: 1.0,
        ignoreErrors: SENTRY_IGNORE_ERRORS,
        denyUrls: SENTRY_DENY_URLS,
        beforeSend: sentryBeforeSend,
      });
    }

    if (environment.newRelicEnabled) {
      const { BrowserAgent } = await import('@newrelic/browser-agent/loaders/browser-agent');

      new BrowserAgent({
        init: {
          distributed_tracing: { enabled: environment.newRelicInitDistributedTracingEnabled },
          performance: { capture_measures: environment.newRelicInitPerformanceCaptureMeasures },
          privacy: { cookies_enabled: environment.newRelicInitPrivacyCookiesEnabled },
          ajax: { deny_list: environment.newRelicInitAjaxDenyList },
        },
        info: {
          beacon: environment.newRelicInfoBeacon,
          errorBeacon: environment.newRelicInfoErrorBeacon,
          licenseKey: environment.newRelicInfoLicenseKey,
          applicationID: environment.newRelicInfoApplicationID,
          sa: environment.newRelicInfoSa,
        },
        loader_config: {
          accountID: environment.newRelicLoaderConfigAccountID,
          trustKey: environment.newRelicLoaderConfigTrustKey,
          agentID: environment.newRelicLoaderConfigAgentID,
          licenseKey: environment.newRelicLoaderConfigLicenseKey,
          applicationID: environment.newRelicLoaderConfigApplicationID,
        },
      });
    }
  };
}

/**
 * Registers application bootstrap initialization via `provideAppInitializer`.
 *
 * Blocks startup until runtime config is loaded and browser integrations
 * (GTM, Sentry, New Relic) are configured when enabled.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/angular/
 * @see https://angular.io/api/core/provideAppInitializer
 */
export const APPLICATION_INITIALIZATION_PROVIDER = provideAppInitializer(initializeApplication());
