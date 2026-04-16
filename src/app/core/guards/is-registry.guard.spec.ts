import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Observable } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { UserModel } from '@osf/shared/models/user/user.model';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { isRegistryGuard } from './is-registry.guard';

describe('isRegistryGuard', () => {
  let router: RouterMockType;
  let store: Store;

  const createSegments = (...paths: string[]): UrlSegment[] => paths.map((path) => ({ path }) as UrlSegment);

  const createResource = (overrides?: Partial<CurrentResource>): CurrentResource => ({
    id: 'resource-id',
    type: CurrentResourceType.Registrations,
    permissions: [],
    ...overrides,
  });

  const createUser = (overrides?: Partial<UserModel>): UserModel => ({
    ...MOCK_USER,
    ...overrides,
  });

  function setup(overrides?: { resource?: CurrentResource | null; currentUser?: UserModel | null; routeId?: string }) {
    const resource = overrides && 'resource' in overrides ? overrides.resource : createResource({ id: 'registry-id' });
    const currentUser = overrides?.currentUser ?? createUser();
    const routeId = overrides?.routeId ?? 'registry-id';

    router = RouterMockBuilder.create().withUrl(`/${routeId}`).withNavigate(vi.fn().mockResolvedValue(true)).build();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideMockStore({
          selectors: [
            { selector: CurrentResourceSelectors.getCurrentResource, value: resource },
            { selector: UserSelectors.getCurrentUser, value: currentUser },
          ],
        }),
        MockProvider(Router, router),
      ],
    });

    store = TestBed.inject(Store);
  }

  async function resolveGuard(segments: UrlSegment[]) {
    const result = TestBed.runInInjectionContext(() => isRegistryGuard({} as Route, segments));
    if (typeof result === 'boolean') {
      return result;
    }
    return firstValueFrom(result as Observable<boolean>);
  }

  it('should return false when id is missing', async () => {
    setup();
    const result = await resolveGuard([]);
    expect(result).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return false when resource is missing', async () => {
    setup({ resource: null });
    const result = await resolveGuard(createSegments('registry-id'));
    expect(result).toBe(false);
  });

  it('should return false when resource id does not start with route id', async () => {
    setup({ resource: createResource({ id: 'different-id' }) });
    const result = await resolveGuard(createSegments('registry-id'));
    expect(result).toBe(false);
  });

  it('should return true for registration without parentId', async () => {
    setup({
      resource: createResource({ id: 'registry-id', type: CurrentResourceType.Registrations, parentId: undefined }),
    });
    const result = await resolveGuard(createSegments('registry-id'));
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to parent files route for registration with parentId', async () => {
    setup({
      resource: createResource({ id: 'registry-id', type: CurrentResourceType.Registrations, parentId: 'parent-1' }),
    });
    const result = await resolveGuard(createSegments('registry-id'));
    expect(result).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'parent-1', 'files', 'registry-id'], {
      queryParamsHandling: 'preserve',
    });
  });

  it('should navigate to preprint route for preprint resource with parentId', async () => {
    setup({
      resource: createResource({ id: 'registry-id', type: CurrentResourceType.Preprints, parentId: 'preprint-1' }),
    });
    const result = await resolveGuard(createSegments('registry-id'));
    expect(result).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/preprints', 'preprint-1', 'registry-id']);
  });

  it('should navigate to profile for current user resource and return false', async () => {
    setup({
      resource: createResource({ id: 'user-1', type: CurrentResourceType.Users }),
      currentUser: createUser({ id: 'user-1' }),
      routeId: 'user-1',
    });
    const result = await resolveGuard(createSegments('user-1'));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should navigate to user page for other user resource and return false', async () => {
    setup({
      resource: createResource({ id: 'user-2', type: CurrentResourceType.Users }),
      currentUser: createUser({ id: 'user-1' }),
      routeId: 'user-2',
    });
    const result = await resolveGuard(createSegments('user-2'));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/user', 'user-2']);
  });

  it('should dispatch GetResource with route id', async () => {
    setup({ routeId: 'registry-id' });
    await resolveGuard(createSegments('registry-id'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetResource('registry-id'));
  });
});
