import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

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
      isValidProvider: vi.fn((providerName: string) => validProviders.includes(providerName.toLowerCase())),
    };

    TestBed.configureTestingModule({
      providers: [MockProvider(FileProviderRegistryService, registry)],
    });
  });

  it('should return true when id matches a built-in FileProvider value', () => {
    Object.values(FileProvider).forEach((provider) => {
      expect(runGuard(createSegments(provider))).toBe(true);
      expect(registry.isValidProvider).toHaveBeenCalledWith(provider);
    });
  });

  it('should return true when id matches an external provider registered in gravyvalet', () => {
    expect(runGuard(createSegments(FOREIGN_PROVIDER))).toBe(true);
    expect(registry.isValidProvider).toHaveBeenCalledWith(FOREIGN_PROVIDER);
  });

  it('should return false when id does not match any registered provider', () => {
    expect(runGuard(createSegments('invalid-provider'))).toBe(false);
    expect(registry.isValidProvider).toHaveBeenCalledWith('invalid-provider');
  });

  it('should return false when the registry has no providers', () => {
    registry.isValidProvider.mockReturnValue(false);

    expect(runGuard(createSegments(FileProvider.OsfStorage))).toBe(false);
  });

  it('should only check the first segment', () => {
    expect(runGuard(createSegments(FileProvider.GoogleDrive, 'subfolder', 'file.txt'))).toBe(true);
    expect(registry.isValidProvider).toHaveBeenCalledTimes(1);
    expect(registry.isValidProvider).toHaveBeenCalledWith(FileProvider.GoogleDrive);
  });

  it('should return false when segments array is empty', () => {
    expect(runGuard([])).toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });

  it('should return false when first segment has no path', () => {
    expect(runGuard(createSegments(''))).toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });

  it('should return false when first segment is undefined', () => {
    expect(runGuard([undefined as unknown as UrlSegment])).toBe(false);
    expect(registry.isValidProvider).not.toHaveBeenCalled();
  });
});
