import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Observable } from 'rxjs';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { isFileGuard } from './is-file.guard';

describe('isFileGuard', () => {
  let router: RouterMockType;
  let store: Store;

  const createSegments = (...paths: string[]): UrlSegment[] => paths.map((path) => ({ path }) as UrlSegment);

  const createResource = (overrides?: Partial<CurrentResource>): CurrentResource => ({
    id: 'file-id',
    type: CurrentResourceType.Files,
    permissions: [],
    ...overrides,
  });

  function setup(overrides?: {
    resource?: CurrentResource | null;
    platformId?: 'browser' | 'server';
    routerUrl?: string;
    browserSearch?: string;
  }) {
    const resource = overrides && 'resource' in overrides ? overrides.resource : createResource();
    const platformId = overrides?.platformId ?? 'browser';
    const routerUrl = overrides?.routerUrl ?? '/file-id';
    const browserSearch = overrides?.browserSearch ?? '';

    if (platformId === 'browser') {
      window.history.replaceState({}, '', `/guard-test${browserSearch}`);
    }

    router = RouterMockBuilder.create().withUrl(routerUrl).withNavigate(vi.fn().mockResolvedValue(true)).build();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideMockStore({
          selectors: [{ selector: CurrentResourceSelectors.getCurrentResource, value: resource }],
        }),
        MockProvider(Router, router),
        MockProvider(PLATFORM_ID, platformId),
      ],
    });

    store = TestBed.inject(Store);
  }

  async function resolveGuard(segments: UrlSegment[]) {
    const result = TestBed.runInInjectionContext(() => isFileGuard({} as Route, segments));
    if (typeof result === 'boolean') {
      return result;
    }
    return firstValueFrom(result as Observable<boolean>);
  }

  it('should return false when id is missing', async () => {
    setup();
    const result = await resolveGuard([]);
    expect(result).toBe(false);
  });

  it('should return false when current resource is missing', async () => {
    setup({ resource: null });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return false when current resource id does not match route id', async () => {
    setup({ resource: createResource({ id: 'different-id' }) });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return true for metadata path on file resource', async () => {
    setup({ resource: createResource({ parentId: 'node-1' }) });
    const result = await resolveGuard(createSegments('file-id', 'metadata'));
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to parent files route with browser view_only query param', async () => {
    setup({
      resource: createResource({ parentId: 'node-1' }),
      browserSearch: '?view_only=token-123',
    });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'node-1', 'files', 'file-id'], {
      queryParams: { view_only: 'token-123' },
    });
  });

  it('should navigate to parent files route with server view_only query param', async () => {
    setup({
      platformId: 'server',
      routerUrl: '/files/file-id?view_only=srv-token',
      resource: createResource({ parentId: 'node-1' }),
    });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'node-1', 'files', 'file-id'], {
      queryParams: { view_only: 'srv-token' },
    });
  });

  it('should return true for file resource without parentId', async () => {
    setup({ resource: createResource({ parentId: undefined }) });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return false for non-file resource', async () => {
    setup({ resource: createResource({ type: CurrentResourceType.Projects }) });
    const result = await resolveGuard(createSegments('file-id'));
    expect(result).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch GetResource with route id', async () => {
    setup();
    await resolveGuard(createSegments('file-id'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetResource('file-id'));
  });
});
