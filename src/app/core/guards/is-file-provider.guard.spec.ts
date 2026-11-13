import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Route, UrlSegment } from '@angular/router';

import { FileProviderRegistryService } from '@core/services/file-provider-registry.service';
import { FileProvider } from '@osf/features/files/constants';

import { isFileProvider } from './is-file-provider.guard';

describe('isFileProvider', () => {
  let registry: { isValidProvider: Mock };

  const FOREIGN_PROVIDER = 's3compat';
  const route: Route = {};

  const createSegments = (...paths: string[]): UrlSegment[] => paths.map((path) => new UrlSegment(path, {}));

  const runGuard = (segments: UrlSegment[]) => TestBed.runInInjectionContext(() => isFileProvider(route, segments));

  beforeEach(() => {
    const validProviders: string[] = [...Object.values(FileProvider), FOREIGN_PROVIDER];

    registry = {
      isValidProvider: vi.fn(async (providerName: string) => validProviders.includes(providerName)),
    };

    TestBed.configureTestingModule({
      providers: [MockProvider(FileProviderRegistryService, registry)],
    });
  });

  it('should return true when id matches a built-in FileProvider value', async () => {
    for (const provider of Object.values(FileProvider)) {
      await expect(runGuard(createSegments(provider))).resolves.toBe(true);
      expect(registry.isValidProvider).toHaveBeenCalledWith(provider);
    }
  });

  it('should return true when id matches an external provider registered in gravyvalet', async () => {
    await expect(runGuard(createSegments(FOREIGN_PROVIDER))).resolves.toBe(true);
    expect(registry.isValidProvider).toHaveBeenCalledWith(FOREIGN_PROVIDER);
  });

  it('should return false when id does not match any registered provider', async () => {
    await expect(runGuard(createSegments('invalid-provider'))).resolves.toBe(false);
    expect(registry.isValidProvider).toHaveBeenCalledWith('invalid-provider');
  });

  it('should return false when the registry cannot ask gravyvalet', async () => {
    registry.isValidProvider.mockRejectedValue(new HttpErrorResponse({ status: 503 }));

    await expect(runGuard(createSegments(FOREIGN_PROVIDER))).resolves.toBe(false);
  });

  it('should only check the first segment', async () => {
    await expect(runGuard(createSegments(FileProvider.GoogleDrive, 'subfolder', 'file.txt'))).resolves.toBe(true);
    expect(registry.isValidProvider).toHaveBeenCalledTimes(1);
    expect(registry.isValidProvider).toHaveBeenCalledWith(FileProvider.GoogleDrive);
  });

  it('should return false when segments array is empty', async () => {
    await expect(runGuard([])).resolves.toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });

  it('should return false when first segment has no path', async () => {
    await expect(runGuard(createSegments(''))).resolves.toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });

  it('should return false when first segment is undefined', async () => {
    await expect(runGuard([undefined as unknown as UrlSegment])).resolves.toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });
});
