import { HttpTestingController } from '@angular/common/http/testing';
import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OSFConfigService } from '@core/services/osf-config.service';

import { initializeApplication } from './application.initialization.provider';
import { ENVIRONMENT } from './environment.provider';

import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import * as Sentry from '@sentry/angular';
import { NEW_RELIC_CONFIG_MOCK } from '@testing/mocks/new-relic.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { GoogleTagManagerConfiguration } from 'angular-google-tag-manager';

jest.mock('@sentry/angular', () => ({
  init: jest.fn(),
  createErrorHandler: jest.fn(() => 'mockErrorHandler'),
}));

describe('Provider: sentry', () => {
  let osfConfigServiceMock: OSFConfigService;
  let googleTagManagerConfigurationMock: GoogleTagManagerConfiguration;
  let httpMock: HttpTestingController;

  const configServiceMock = {
    load: jest.fn(),
  } as unknown as jest.Mocked<OSFConfigService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [
        {
          provide: OSFConfigService,
          useValue: configServiceMock,
        },
        {
          provide: GoogleTagManagerConfiguration,
          useValue: {
            set: jest.fn(),
          },
        },
        {
          provide: ENVIRONMENT,
          useValue: {
            googleTagManagerId: 'google-id',
            sentryDsn: 'https://dsn.url',
          },
        },
      ],
    }).compileComponents();

    osfConfigServiceMock = TestBed.inject(OSFConfigService);
    googleTagManagerConfigurationMock = TestBed.inject(GoogleTagManagerConfiguration);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Sentry if DSN is provided', async () => {
    await runInInjectionContext(TestBed, async () => {
      await initializeApplication()();
    });

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: 'https://dsn.url',
      integrations: [],
      environment: 'development',
      maxBreadcrumbs: 50,
      sampleRate: 1,
    });

    expect(googleTagManagerConfigurationMock.set).toHaveBeenCalledWith({
      id: 'google-id',
    });
    expect(osfConfigServiceMock.load).toHaveBeenCalledWith();

    expect(httpMock.verify).toBeTruthy();
  });

  it('should initialize Sentry if DSN is missing', async () => {
    const environment = TestBed.inject(ENVIRONMENT);
    environment.sentryDsn = '';
    environment.googleTagManagerId = '';
    await runInInjectionContext(TestBed, async () => {
      await initializeApplication()();
    });

    expect(Sentry.init).not.toHaveBeenCalled();

    expect(googleTagManagerConfigurationMock.set).not.toHaveBeenCalled();
    expect(httpMock.verify).toBeTruthy();
  });

  it('should initialize New Relic if enabled', async () => {
    const environment = TestBed.inject(ENVIRONMENT);
    Object.assign(environment, NEW_RELIC_CONFIG_MOCK);

    await runInInjectionContext(TestBed, async () => {
      await initializeApplication()();
    });

    expect(BrowserAgent).toHaveBeenCalledTimes(1);
    expect(httpMock.verify).toBeTruthy();
  });

  it('should not initialize New Relic if disabled', async () => {
    const environment = TestBed.inject(ENVIRONMENT);
    environment.newRelicEnabled = false;

    await runInInjectionContext(TestBed, async () => {
      await initializeApplication()();
    });

    expect(BrowserAgent).not.toHaveBeenCalled();
    expect(httpMock.verify).toBeTruthy();
  });
});
