import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OSFConfigService } from '@core/services/osf-config.service';

import { initializeApplication } from './application.initialization.factory';

import * as Sentry from '@sentry/angular';
import { OSFTestingModule } from '@testing/osf.testing.module';

jest.mock('@sentry/angular', () => ({
  init: jest.fn(),
  createErrorHandler: jest.fn(() => 'mockErrorHandler'),
}));

describe('factory: sentry', () => {
  const configServiceMock = {
    get: jest.fn(),
  } as unknown as jest.Mocked<OSFConfigService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [
        {
          provide: OSFConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Sentry if DSN is provided', async () => {
    const service = TestBed.inject(OSFConfigService);
    jest.spyOn(service, 'get').mockResolvedValue('https://dsn.url');
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
  });

  it('should initialize Sentry if DSN is missind', async () => {
    const service = TestBed.inject(OSFConfigService);
    jest.spyOn(service, 'get').mockResolvedValue(null);
    await runInInjectionContext(TestBed, async () => {
      await initializeApplication()();
    });

    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
