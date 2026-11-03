import { MockProvider } from 'ng-mocks';

import { TimeoutError } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { FileProvider } from '@osf/features/files/constants';
import { AddonGetListResponseJsonApi } from '@osf/shared/models/addons/external-addon-json-api.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';
import { LoaderServiceMock, provideLoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { FILE_PROVIDER_REGISTRY_TIMEOUT_MS, FileProviderRegistryService } from './file-provider-registry.service';

describe('FileProviderRegistryService', () => {
  let service: FileProviderRegistryService;
  let httpMock: HttpTestingController;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  const FOREIGN_PROVIDER = 's3compat';
  const isRegistryRequest = (request: { url: string; method: string }) =>
    request.url === 'http://addons.localhost:8000/external-storage-services' && request.method === 'GET';
  const expectRequest = () => httpMock.expectOne(isRegistryRequest);

  const getListingWithForeignProvider = (externalServiceName: string = FOREIGN_PROVIDER) => {
    const listing = getAddonsExternalStorageData() as unknown as AddonGetListResponseJsonApi;
    listing.data[0].attributes.external_service_name = externalServiceName;
    return listing;
  };

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideOSFHttp(),
        provideLoaderServiceMock(loaderService),
        MockProvider(ToastService, toastService),
      ],
    });

    service = TestBed.inject(FileProviderRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should not request anything when it is created', () => {
    httpMock.expectNone(isRegistryRequest);
  });

  it('should accept every built-in provider without asking gravyvalet', async () => {
    for (const provider of Object.values(FileProvider)) {
      await expect(service.isValidProvider(provider)).resolves.toBe(true);
    }

    httpMock.expectNone(isRegistryRequest);
  });

  it('should refuse a built-in name written in another case', async () => {
    const result = service.isValidProvider('OsfStorage');
    expectRequest().flush(getListingWithForeignProvider());

    await expect(result).resolves.toBe(false);
    await expect(service.isValidProvider('DropBox')).resolves.toBe(false);
  });

  it('should refuse a reserved name without asking gravyvalet', async () => {
    await expect(service.isValidProvider('metadata')).resolves.toBe(false);

    httpMock.expectNone(isRegistryRequest);
  });

  it('should refuse a reserved name even when gravyvalet lists a service of that name', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush(getListingWithForeignProvider('metadata'));
    await result;

    await expect(service.isValidProvider('metadata')).resolves.toBe(false);
  });

  it('should ask gravyvalet for the external storage services when a name is not built-in', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);

    const request = expectRequest();
    expect(request.request.params.get('fields[external-storage-services]')).toBe('external_service_name');
    request.flush(getListingWithForeignProvider());

    await expect(result).resolves.toBe(true);
  });

  it('should leave the request to the global error interceptor', () => {
    service.isValidProvider(FOREIGN_PROVIDER);

    const request = expectRequest();
    expect(request.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(false);
    request.flush(getListingWithForeignProvider());
  });

  it('should show the full-screen loader while it waits for gravyvalet', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);

    const request = expectRequest();
    expect(loaderService.show).toHaveBeenCalledTimes(1);
    expect(loaderService.hide).not.toHaveBeenCalled();

    request.flush(getListingWithForeignProvider());
    await result;

    expect(loaderService.hide).toHaveBeenCalledTimes(1);
  });

  it('should hide the full-screen loader when the request fails', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await expect(result).rejects.toBeDefined();

    expect(loaderService.show).toHaveBeenCalledTimes(1);
    expect(loaderService.hide).toHaveBeenCalledTimes(1);
  });

  it('should not show the full-screen loader for a name that needs no request', async () => {
    await service.isValidProvider(FileProvider.OsfStorage);
    await service.isValidProvider('metadata');

    const first = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush(getListingWithForeignProvider());
    await first;
    await service.isValidProvider(FOREIGN_PROVIDER);

    expect(loaderService.show).toHaveBeenCalledTimes(1);
  });

  it('should refuse an external provider name written in another case', async () => {
    const result = service.isValidProvider('S3Compat');
    expectRequest().flush(getListingWithForeignProvider());

    await expect(result).resolves.toBe(false);
    await expect(service.isValidProvider(FOREIGN_PROVIDER)).resolves.toBe(true);
  });

  it('should reject a name that gravyvalet does not list', async () => {
    const result = service.isValidProvider('unknownprovider');
    expectRequest().flush(getListingWithForeignProvider());

    await expect(result).resolves.toBe(false);
  });

  it('should skip external services without a service name', async () => {
    const result = service.isValidProvider('');
    expectRequest().flush(getListingWithForeignProvider(''));

    await expect(result).resolves.toBe(false);
  });

  it('should keep the external storage services after the first request', async () => {
    const first = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush(getListingWithForeignProvider());
    await first;

    await expect(service.isValidProvider(FOREIGN_PROVIDER)).resolves.toBe(true);
    await expect(service.isValidProvider('unknownprovider')).resolves.toBe(false);

    httpMock.expectNone(isRegistryRequest);
  });

  it('should send one request for concurrent lookups', async () => {
    const results = Promise.all([
      service.isValidProvider(FOREIGN_PROVIDER),
      service.isValidProvider('unknownprovider'),
      service.isValidProvider(FOREIGN_PROVIDER),
    ]);
    expectRequest().flush(getListingWithForeignProvider());

    await expect(results).resolves.toEqual([true, false, true]);
  });

  it('should reject when the request fails', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

    await expect(result).rejects.toMatchObject({ status: 503 });
  });

  it('should still accept built-in providers after a failed request', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await expect(result).rejects.toBeDefined();

    await expect(service.isValidProvider(FileProvider.OsfStorage)).resolves.toBe(true);

    httpMock.expectNone(isRegistryRequest);
  });

  it('should ask gravyvalet again after a failed request', async () => {
    const failed = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await expect(failed).rejects.toBeDefined();

    const retried = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush(getListingWithForeignProvider());

    await expect(retried).resolves.toBe(true);
  });

  it('should not report a failed request itself, as the error interceptor does it', async () => {
    const result = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await expect(result).rejects.toBeDefined();

    expect(toastService.showError).not.toHaveBeenCalled();
  });

  it('should give the request up and tell the user when gravyvalet does not answer in time', async () => {
    vi.useFakeTimers();

    const result = service.isValidProvider(FOREIGN_PROVIDER);
    const rejection = expect(result).rejects.toBeInstanceOf(TimeoutError);
    const request = expectRequest();
    await vi.advanceTimersByTimeAsync(FILE_PROVIDER_REGISTRY_TIMEOUT_MS);
    await rejection;

    expect(request.cancelled).toBe(true);
    expect(toastService.showError).toHaveBeenCalledTimes(1);
    expect(toastService.showError).toHaveBeenCalledWith('common.errorMessages.serverError');
    expect(loaderService.hide).toHaveBeenCalledTimes(1);
  });

  it('should accept an answer that arrives just before the time is up', async () => {
    vi.useFakeTimers();

    const result = service.isValidProvider(FOREIGN_PROVIDER);
    const request = expectRequest();
    await vi.advanceTimersByTimeAsync(FILE_PROVIDER_REGISTRY_TIMEOUT_MS - 1);
    request.flush(getListingWithForeignProvider());

    await expect(result).resolves.toBe(true);
    expect(toastService.showError).not.toHaveBeenCalled();
  });

  it('should ask gravyvalet again after it did not answer in time', async () => {
    vi.useFakeTimers();

    const timedOut = service.isValidProvider(FOREIGN_PROVIDER);
    const rejection = expect(timedOut).rejects.toBeInstanceOf(TimeoutError);
    expectRequest();
    await vi.advanceTimersByTimeAsync(FILE_PROVIDER_REGISTRY_TIMEOUT_MS);
    await rejection;

    const retried = service.isValidProvider(FOREIGN_PROVIDER);
    expectRequest().flush(getListingWithForeignProvider());

    await expect(retried).resolves.toBe(true);
  });
});
