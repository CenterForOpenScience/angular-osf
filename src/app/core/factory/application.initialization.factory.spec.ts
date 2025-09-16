import { HttpTestingController } from '@angular/common/http/testing';
import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OSFConfigService } from '@core/services/osf-config.service';

import { initializeApplication } from './application.initialization.factory';
import { ENVIRONMENT } from './environment.factory';

import * as Sentry from '@sentry/angular';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { GoogleTagManagerConfiguration } from 'angular-google-tag-manager';

jest.mock('@sentry/angular', () => ({
  init: jest.fn(),
  createErrorHandler: jest.fn(() => 'mockErrorHandler'),
}));

describe('factory: sentry', () => {
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
});
