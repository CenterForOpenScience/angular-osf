import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { FileProvider } from '@osf/features/files/constants';
import { AddonGetListResponseJsonApi } from '@osf/shared/models/addons/external-addon-json-api.model';

import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { FILE_PROVIDER_REGISTRY_TIMEOUT_MS, FileProviderRegistryService } from './file-provider-registry.service';

describe('FileProviderRegistryService', () => {
  let service: FileProviderRegistryService;
  let httpMock: HttpTestingController;

  const FOREIGN_PROVIDER = 's3compat';
  const expectRequest = () =>
    httpMock.expectOne(
      (request) => request.url === 'http://addons.localhost:8000/external-storage-services' && request.method === 'GET'
    );

  // The listing gravyvalet serves, with one service that is not a built-in provider
  const getListing = () => getAddonsExternalStorageData() as unknown as AddonGetListResponseJsonApi;

  const getListingWithForeignProvider = (externalServiceName: string = FOREIGN_PROVIDER) => {
    const listing = getListing();
    listing.data[0].attributes.external_service_name = externalServiceName;
    return listing;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp()],
    });

    service = TestBed.inject(FileProviderRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not be initialized before initialize is called', () => {
    expect(service.isInitialized()).toBe(false);
    expect(service.isValidProvider(FileProvider.OsfStorage)).toBe(false);
    expect(service.getValidProviders()).toEqual([]);
  });

  it('should request the names of the external storage services outside the error interceptor', async () => {
    const initialization = service.initialize();

    const request = expectRequest();
    expect(request.request.params.get('fields[external-storage-services]')).toBe('external_service_name');
    expect(request.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    request.flush(getListingWithForeignProvider());
    await initialization;

    expect(service.isInitialized()).toBe(true);
  });

  it('should accept every built-in provider after initialization', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListingWithForeignProvider());
    await initialization;

    Object.values(FileProvider).forEach((provider) => {
      expect(service.isValidProvider(provider)).toBe(true);
    });
  });

  it('should accept external providers registered in gravyvalet', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListingWithForeignProvider());
    await initialization;

    expect(service.isValidProvider(FOREIGN_PROVIDER)).toBe(true);
    expect(service.getValidProviders()).toEqual(expect.arrayContaining([FOREIGN_PROVIDER, FileProvider.OsfStorage]));
  });

  it('should match provider names case-insensitively', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListingWithForeignProvider('S3Compat'));
    await initialization;

    expect(service.isValidProvider('s3compat')).toBe(true);
    expect(service.isValidProvider('S3COMPAT')).toBe(true);
    expect(service.isValidProvider('OsfStorage')).toBe(true);
  });

  it('should reject unknown providers', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListingWithForeignProvider());
    await initialization;

    expect(service.isValidProvider('unknownprovider')).toBe(false);
  });

  it('should list a provider once when it is both built-in and external', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListing());
    await initialization;

    expect(service.getValidProviders()).toHaveLength(Object.values(FileProvider).length);
  });

  it('should skip external services without a service name', async () => {
    const initialization = service.initialize();
    expectRequest().flush(getListingWithForeignProvider(''));
    await initialization;

    expect(service.isValidProvider('')).toBe(false);
    expect(service.getValidProviders()).toHaveLength(Object.values(FileProvider).length);
  });

  it('should fall back to built-in providers when the request fails', async () => {
    const initialization = service.initialize();
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await initialization;

    expect(service.isInitialized()).toBe(true);
    expect(service.isValidProvider(FileProvider.OsfStorage)).toBe(true);
    expect(service.isValidProvider(FOREIGN_PROVIDER)).toBe(false);
  });

  it('should fall back to built-in providers when the request does not answer in time', async () => {
    vi.useFakeTimers();

    const initialization = service.initialize();
    const request = expectRequest();
    await vi.advanceTimersByTimeAsync(FILE_PROVIDER_REGISTRY_TIMEOUT_MS);
    await initialization;

    expect(request.cancelled).toBe(true);
    expect(service.isInitialized()).toBe(true);
    expect(service.isValidProvider(FileProvider.OsfStorage)).toBe(true);
    expect(service.isValidProvider(FOREIGN_PROVIDER)).toBe(false);

    vi.useRealTimers();
  });

  it('should send one request for concurrent and repeated initializations', async () => {
    const initializations = Promise.all([service.initialize(), service.initialize(), service.initialize()]);
    expectRequest().flush(getListingWithForeignProvider());
    await initializations;

    await service.initialize();

    expect(service.isInitialized()).toBe(true);
  });
});
