import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FileProviderRegistryService } from '@core/services/file-provider-registry.service';
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
  let fileProviderRegistryMock: { initialize: ReturnType<typeof vi.fn> };
  let googleTagManagerConfigurationMock: { set: ReturnType<typeof vi.fn> };
  let environment: EnvironmentModel;
  let sentryInitMock: ReturnType<typeof vi.fn>;
  let sentryMock: SentryMockType;

  function setup(platformId: 'browser' | 'server', environmentOverrides: Partial<EnvironmentModel> = {}) {
    configServiceMock = { load: vi.fn().mockResolvedValue(undefined) };
    fileProviderRegistryMock = { initialize: vi.fn().mockResolvedValue(undefined) };
    googleTagManagerConfigurationMock = { set: vi.fn() };
    sentryMock = SentryMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(PLATFORM_ID, platformId),
        { provide: OSFConfigService, useValue: configServiceMock },
        { provide: FileProviderRegistryService, useValue: fileProviderRegistryMock },
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
    expect(fileProviderRegistryMock.initialize).toHaveBeenCalled();
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
    expect(fileProviderRegistryMock.initialize).toHaveBeenCalled();
    expect(googleTagManagerConfigurationMock.set).not.toHaveBeenCalled();
    expect(sentryInitMock).not.toHaveBeenCalled();
  });

  it('should initialize the file provider registry only after the config is loaded', async () => {
    setup('browser');
    let resolveConfig: () => void = () => undefined;
    configServiceMock.load.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveConfig = resolve;
      })
    );

    const initialization = TestBed.runInInjectionContext(async () => initializeApplication()());
    await new Promise((resolve) => setTimeout(resolve));

    expect(configServiceMock.load).toHaveBeenCalled();
    expect(fileProviderRegistryMock.initialize).not.toHaveBeenCalled();

    resolveConfig();
    await initialization;

    expect(fileProviderRegistryMock.initialize).toHaveBeenCalledTimes(1);
  });

  it('should not complete before the file provider registry is initialized', async () => {
    setup('browser');
    let resolveRegistry: () => void = () => undefined;
    fileProviderRegistryMock.initialize.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveRegistry = resolve;
      })
    );
    let completed = false;

    const initialization = TestBed.runInInjectionContext(async () => initializeApplication()()).then(() => {
      completed = true;
    });
    await new Promise((resolve) => setTimeout(resolve));

    expect(completed).toBe(false);

    resolveRegistry();
    await initialization;

    expect(completed).toBe(true);
  });
});
