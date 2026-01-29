import { ParamMap, UrlSegment } from '@angular/router';

import { FileProvider } from '@osf/features/files/constants';

import { isFileProvider } from './is-file-provider.guard';

describe('isFileProvider', () => {
  const createMockParamMap = (): ParamMap => ({
    get: () => null,
    getAll: () => [],
    has: () => false,
    keys: [],
  });

  const createMockSegment = (path: string): UrlSegment => ({
    path,
    parameters: {},
    parameterMap: createMockParamMap(),
  });

  const createMockSegments = (path: string) => [createMockSegment(path)];

  it('should return true when id matches a FileProvider value', () => {
    Object.values(FileProvider).forEach((provider) => {
      const result = isFileProvider({} as any, createMockSegments(provider));
      expect(result).toBe(true);
    });
  });

  it('should return false when id does not match any FileProvider value', () => {
    const result = isFileProvider({} as any, createMockSegments('invalid-provider'));
    expect(result).toBe(false);
  });

  it('should return false when segments array is empty', () => {
    const result = isFileProvider({} as any, []);
    expect(result).toBe(false);
  });

  it('should return false when first segment has no path', () => {
    const result = isFileProvider({} as any, [createMockSegment('')]);
    expect(result).toBe(false);
  });

  it('should return false when first segment is undefined', () => {
    const result = isFileProvider({} as any, [undefined as any]);
    expect(result).toBe(false);
  });
});
