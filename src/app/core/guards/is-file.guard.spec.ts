import { of } from 'rxjs';

import { PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

import { isFileGuard } from './is-file.guard';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('isFileGuard', () => {
  let router: Router;

  const createMockResource = (overrides?: Partial<CurrentResource>): CurrentResource => ({
    id: 'file-id',
    type: CurrentResourceType.Files,
    permissions: [],
    ...overrides,
  });

  const createMockSegments = (path: string, secondPath?: string) => {
    const segments = [{ path }] as any[];
    if (secondPath) {
      segments.push({ path: secondPath });
    }
    return segments;
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost/test',
      },
    });

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [],
          actions: [],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);
    jest.clearAllMocks();
  });

  it('should return false when id is missing', () => {
    const result = runInInjectionContext(TestBed, () => {
      return isFileGuard({} as any, []);
    });

    expect(result).toBe(false);
  });

  it('should return false when resource is not found', (done) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: null,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should return false when resource id does not match exactly', (done) => {
    const resource = createMockResource({ id: 'different-id' });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should return true for Files with metadata path', (done) => {
    const resource = createMockResource({
      id: 'file-id',
      type: CurrentResourceType.Files,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id', 'metadata'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  it('should navigate and return false for Files with parentId', (done) => {
    const resource = createMockResource({
      id: 'file-id',
      type: CurrentResourceType.Files,
      parentId: 'parent-id',
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/', 'parent-id', 'files', 'file-id'], {});
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should return true for Files without parentId', (done) => {
    const resource = createMockResource({
      id: 'file-id',
      type: CurrentResourceType.Files,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  it('should return false for other resource types', (done) => {
    const resource = createMockResource({
      id: 'resource-id',
      type: CurrentResourceType.Projects,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('resource-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('resource-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should include view_only param in navigation when present in router.url (server-side)', (done) => {
    const resource = createMockResource({
      id: 'file-id',
      type: CurrentResourceType.Files,
      parentId: 'parent-id',
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test?view_only=abc123').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/', 'parent-id', 'files', 'file-id'], {
            queryParams: { view_only: 'abc123' },
          });
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should include view_only param in navigation when present in window.location (browser)', (done) => {
    const resource = createMockResource({
      id: 'file-id',
      type: CurrentResourceType.Files,
      parentId: 'parent-id',
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost/test?view_only=xyz789',
      },
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
          ],
          actions: [
            {
              action: new GetResource('file-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isFileGuard({} as any, createMockSegments('file-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/', 'parent-id', 'files', 'file-id'], {
            queryParams: { view_only: 'xyz789' },
          });
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });
});
