import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Observable } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { redirectIfLoggedInGuard } from './redirect-if-logged-in.guard';

describe('redirectIfLoggedInGuard', () => {
  let store: Store;
  let router: RouterMockType;

  function setup(isAuthenticated: boolean) {
    router = RouterMockBuilder.create().withUrl('/login').withNavigate(vi.fn().mockResolvedValue(true)).build();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideMockStore({
          selectors: [{ selector: UserSelectors.isAuthenticated, value: isAuthenticated }],
        }),
        MockProvider(Router, router),
      ],
    });

    store = TestBed.inject(Store);
  }

  async function resolveGuard() {
    const result = TestBed.runInInjectionContext(() => redirectIfLoggedInGuard({} as never, {} as never));
    if (typeof result === 'boolean') {
      return result;
    }
    return firstValueFrom(result as Observable<boolean>);
  }

  it('should redirect to dashboard and return false when user is authenticated', async () => {
    setup(true);

    const result = await resolveGuard();

    expect(result).toBe(false);
    expect(store.dispatch).toHaveBeenCalledWith(GetCurrentUser);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should return true when user is not authenticated', async () => {
    setup(false);

    const result = await resolveGuard();

    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(GetCurrentUser);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch GetCurrentUser before checking authentication state', async () => {
    setup(false);

    await resolveGuard();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(GetCurrentUser);
  });
});
