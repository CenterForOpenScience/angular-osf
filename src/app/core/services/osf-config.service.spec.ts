import { MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SSR_CONFIG } from '@core/constants/ssr-config.token';
import { ConfigModel } from '@core/models/config.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { OSFConfigService } from './osf-config.service';

describe('OSFConfigService', () => {
  let service: OSFConfigService;
  let environment: EnvironmentModel;

  const mockConfig: ConfigModel = {
    sentryDsn: 'https://sentry.example.com/123',
    googleTagManagerId: 'GTM-TEST',
    googleFilePickerApiKey: '',
    googleFilePickerAppId: 0,
    apiDomainUrl: 'https://api.example.com',
  };

  const setupBrowser = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), MockProvider(PLATFORM_ID, 'browser')],
    });

    service = TestBed.inject(OSFConfigService);
    environment = TestBed.inject(ENVIRONMENT);
  };

  const setupServer = (ssrConfig: ConfigModel | null = null) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(PLATFORM_ID, 'server'),
        ...(ssrConfig ? [{ provide: SSR_CONFIG, useValue: ssrConfig }] : []),
      ],
    });

    service = TestBed.inject(OSFConfigService);
    environment = TestBed.inject(ENVIRONMENT);
  };

  it('should load config via HTTP on browser and merge into ENVIRONMENT', async () => {
    setupBrowser();
    const httpMock = TestBed.inject(HttpTestingController);

    const loadPromise = service.load();
    httpMock.expectOne('/assets/config/config.json').flush(mockConfig);
    await loadPromise;

    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.sentryDsn).toBe('https://sentry.example.com/123');
    httpMock.verify();
  });

  it('should only fetch config once on repeated load calls', async () => {
    setupBrowser();
    const httpMock = TestBed.inject(HttpTestingController);

    const firstLoad = service.load();
    httpMock.expectOne('/assets/config/config.json').flush(mockConfig);
    await firstLoad;

    await service.load();
    httpMock.expectNone('/assets/config/config.json');

    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    httpMock.verify();
  });

  it('should fallback to empty config on HTTP error', async () => {
    setupBrowser();
    const httpMock = TestBed.inject(HttpTestingController);
    const originalUrl = environment.apiDomainUrl;

    const loadPromise = service.load();
    httpMock.expectOne('/assets/config/config.json').error(new ProgressEvent('error'));
    await loadPromise;

    expect(environment.apiDomainUrl).toBe(originalUrl);
    httpMock.verify();
  });

  it('should load config from SSR_CONFIG on server and merge into ENVIRONMENT', async () => {
    setupServer(mockConfig);

    await service.load();

    expect(environment.apiDomainUrl).toBe('https://api.example.com');
    expect(environment.sentryDsn).toBe('https://sentry.example.com/123');
  });

  it('should fallback to empty config on server when SSR_CONFIG is not provided', async () => {
    setupServer();
    const originalUrl = environment.apiDomainUrl;

    await service.load();

    expect(environment.apiDomainUrl).toBe(originalUrl);
  });
});
