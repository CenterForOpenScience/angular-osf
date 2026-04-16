import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OSFConfigService } from '@core/services/osf-config.service';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { SentryMock, SentryMockType } from '@testing/providers/sentry-provider.mock';

import { initializeApplication } from './application.initialization.provider';
import { ENVIRONMENT } from './environment.provider';
import { SENTRY_TOKEN } from './sentry.provider';

import * as Sentry from '@sentry/angular';
import { GoogleTagManagerConfiguration } from 'angular-google-tag-manager';

vi.mock('@sentry/angular', () => {
  return {
    init: vi.fn(),
    captureException: vi.fn(),
    ngOnDestroy: vi.fn(),
  };
});

describe('initializeApplication', () => {
  let configServiceMock: { load: ReturnType<typeof vi.fn> };
  let googleTagManagerConfigurationMock: { set: ReturnType<typeof vi.fn> };
  let environment: EnvironmentModel;
  let sentryInitMock: ReturnType<typeof vi.fn>;
  let sentryMock: SentryMockType;

  function setup(platformId: 'browser' | 'server', environmentOverrides: Partial<EnvironmentModel> = {}) {
    configServiceMock = { load: vi.fn().mockResolvedValue(undefined) };
    googleTagManagerConfigurationMock = { set: vi.fn() };
    sentryMock = SentryMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(PLATFORM_ID, platformId),
        { provide: OSFConfigService, useValue: configServiceMock },
        { provide: GoogleTagManagerConfiguration, useValue: googleTagManagerConfigurationMock },
        { provide: SENTRY_TOKEN, useValue: sentryMock },
      ],
    });

    environment = TestBed.inject(ENVIRONMENT);
    Object.assign(environment, environmentOverrides);
    sentryInitMock = vi.mocked(Sentry.init);
    sentryInitMock.mockReset();
  }

  it('should load config and initialize GTM and Sentry in browser when configured', async () => {
    setup('browser', {
      googleTagManagerId: 'GTM-TEST',
      sentryDsn: 'https://dsn.example/123',
      production: true,
    });
    await TestBed.runInInjectionContext(async () => initializeApplication()());

    expect(configServiceMock.load).toHaveBeenCalled();
    expect(googleTagManagerConfigurationMock.set).toHaveBeenCalledWith({ id: 'GTM-TEST' });
    expect(sentryInitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://dsn.example/123',
        environment: 'production',
      })
    );
  });

  it('should load config but skip GTM and Sentry when browser config values are missing', async () => {
    setup('browser', { googleTagManagerId: '', sentryDsn: '' });

    await TestBed.runInInjectionContext(async () => initializeApplication()());

    expect(configServiceMock.load).toHaveBeenCalled();
    expect(googleTagManagerConfigurationMock.set).not.toHaveBeenCalled();
    expect(sentryInitMock).not.toHaveBeenCalled();
  });

  it('should load config and skip browser-only integrations on server', async () => {
    setup('server', {
      googleTagManagerId: 'GTM-TEST',
      sentryDsn: 'https://dsn.example/123',
      production: true,
    });
    await TestBed.runInInjectionContext(async () => initializeApplication()());

    expect(configServiceMock.load).toHaveBeenCalled();
    expect(googleTagManagerConfigurationMock.set).not.toHaveBeenCalled();
    expect(sentryInitMock).not.toHaveBeenCalled();
  });
});
