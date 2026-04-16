import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Observable } from 'rxjs';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let store: Store;
  let router: RouterMockType;
  let authServiceMock: AuthServiceMockType;
  let viewOnlyHelperMock: ViewOnlyLinkHelperMockType;

  function setup({
    isAuthenticated = true,
    hasViewOnlyParam = false,
  }: { isAuthenticated?: boolean; hasViewOnlyParam?: boolean } = {}) {
    router = RouterMockBuilder.create().withUrl('/test').build();
    authServiceMock = AuthServiceMock.simple();
    viewOnlyHelperMock = ViewOnlyLinkHelperMock.simple(hasViewOnlyParam);

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideMockStore({
          selectors: [{ selector: UserSelectors.isAuthenticated, value: isAuthenticated }],
        }),
        MockProvider(Router, router),
        MockProvider(AuthService, authServiceMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelperMock),
      ],
    });

    store = TestBed.inject(Store);
  }

  async function resolveGuardResult() {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    if (typeof result === 'boolean') {
      return result;
    }
    return firstValueFrom(result as Observable<boolean>);
  }

  it('should return true when view-only parameter exists', async () => {
    setup({ hasViewOnlyParam: true });
    const injectedRouter = TestBed.inject(Router);

    const result = await resolveGuardResult();

    expect(result).toBe(true);
    expect(viewOnlyHelperMock.hasViewOnlyParam).toHaveBeenCalledWith(injectedRouter);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(authServiceMock.navigateToSignIn).not.toHaveBeenCalled();
  });

  it('should return true when user is authenticated', async () => {
    setup({ isAuthenticated: true });

    const result = await resolveGuardResult();

    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(GetCurrentUser);
    expect(authServiceMock.navigateToSignIn).not.toHaveBeenCalled();
  });

  it('should navigate to sign in and return false when user is not authenticated', async () => {
    setup({ isAuthenticated: false });
    (store.dispatch as Mock).mockClear();

    const result = await resolveGuardResult();

    expect(result).toBe(false);
    expect(store.dispatch).toHaveBeenCalledWith(GetCurrentUser);
    expect(authServiceMock.navigateToSignIn).toHaveBeenCalled();
  });
});
