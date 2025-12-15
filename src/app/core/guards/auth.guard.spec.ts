import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { authGuard } from './auth.guard';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('authGuard', () => {
  let router: Router;
  let authService: AuthService;
  let viewOnlyHelper: ViewOnlyLinkHelperService;

  beforeEach(() => {
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
        MockProvider(AuthService, {
          navigateToSignIn: jest.fn(),
        }),
        MockProvider(ViewOnlyLinkHelperService, {
          hasViewOnlyParam: jest.fn(),
        }),
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    viewOnlyHelper = TestBed.inject(ViewOnlyLinkHelperService);
    jest.clearAllMocks();
  });

  it('should return true when view-only param exists', () => {
    jest.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);

    const result = runInInjectionContext(TestBed, () => {
      return authGuard({} as any, {} as any);
    });

    expect(result).toBe(true);
    expect(viewOnlyHelper.hasViewOnlyParam).toHaveBeenCalledWith(router);
    expect(authService.navigateToSignIn).not.toHaveBeenCalled();
  });

  it('should return true when user is authenticated', (done) => {
    jest.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: UserSelectors.isAuthenticated,
              value: true,
            },
          ],
          actions: [
            {
              action: GetCurrentUser,
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        MockProvider(AuthService, {
          navigateToSignIn: jest.fn(),
        }),
        MockProvider(ViewOnlyLinkHelperService, {
          hasViewOnlyParam: jest.fn().mockReturnValue(false),
        }),
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);

    runInInjectionContext(TestBed, () => {
      const result = authGuard({} as any, {} as any);

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(authService.navigateToSignIn).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  it('should navigate to sign-in and return false when user is not authenticated', (done) => {
    jest.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: UserSelectors.isAuthenticated,
              value: false,
            },
          ],
          actions: [
            {
              action: GetCurrentUser,
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
        MockProvider(AuthService, {
          navigateToSignIn: jest.fn(),
        }),
        MockProvider(ViewOnlyLinkHelperService, {
          hasViewOnlyParam: jest.fn().mockReturnValue(false),
        }),
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);

    runInInjectionContext(TestBed, () => {
      const result = authGuard({} as any, {} as any);

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(authService.navigateToSignIn).toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });
});
