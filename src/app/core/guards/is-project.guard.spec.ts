import { of } from 'rxjs';

import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

import { isProjectGuard } from './is-project.guard';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('isProjectGuard', () => {
  let router: Router;

  const createMockResource = (overrides?: Partial<CurrentResource>): CurrentResource => ({
    id: 'test-id',
    type: CurrentResourceType.Projects,
    permissions: [],
    ...overrides,
  });

  const createMockSegments = (path: string) => [{ path }] as any[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [],
          actions: [],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);
    jest.clearAllMocks();
  });

  it('should return false when id is missing', () => {
    const result = runInInjectionContext(TestBed, () => {
      return isProjectGuard({} as any, []);
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
              action: new GetResource('test-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('test-id'));

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

  it('should return false when id does not start with resource.id', (done) => {
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
              action: new GetResource('test-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('test-id'));

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

  it('should navigate and return true for Projects with parentId', (done) => {
    const resource = createMockResource({
      id: 'parent-id/child-id',
      type: CurrentResourceType.Projects,
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
              action: new GetResource('parent-id/child-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('parent-id/child-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(router.navigate).toHaveBeenCalledWith(['/', 'parent-id', 'files', 'parent-id/child-id'], {
            queryParamsHandling: 'preserve',
          });
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  it('should return true for Projects without parentId', (done) => {
    const resource = createMockResource({
      id: 'project-id',
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
              action: new GetResource('project-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('project-id'));

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

  it('should navigate and return true for Preprints with parentId', (done) => {
    const resource = createMockResource({
      id: 'parent-id/child-id',
      type: CurrentResourceType.Preprints,
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
              action: new GetResource('parent-id/child-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('parent-id/child-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(router.navigate).toHaveBeenCalledWith(['/preprints', 'parent-id', 'parent-id/child-id']);
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  it('should navigate to profile and return false for Users when current user matches', (done) => {
    const resource = createMockResource({
      id: 'user-id',
      type: CurrentResourceType.Users,
    });
    const currentUser = { id: 'user-id' };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
            {
              selector: UserSelectors.getCurrentUser,
              value: currentUser,
            },
          ],
          actions: [
            {
              action: new GetResource('user-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('user-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/profile']);
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should navigate to user page and return false for Users when current user does not match', (done) => {
    const resource = createMockResource({
      id: 'user-id',
      type: CurrentResourceType.Users,
    });
    const currentUser = { id: 'different-user-id' };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CurrentResourceSelectors.getCurrentResource,
              value: resource,
            },
            {
              selector: UserSelectors.getCurrentUser,
              value: currentUser,
            },
          ],
          actions: [
            {
              action: new GetResource('user-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('user-id'));

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/user', 'user-id']);
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should return false for other resource types', (done) => {
    const resource = createMockResource({
      id: 'resource-id',
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
              action: new GetResource('resource-id'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = isProjectGuard({} as any, createMockSegments('resource-id'));

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
});
