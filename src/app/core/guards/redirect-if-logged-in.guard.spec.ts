import { of } from 'rxjs';

import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';

import { redirectIfLoggedInGuard } from './redirect-if-logged-in.guard';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('redirectIfLoggedInGuard', () => {
  let router: Router;

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

  it('should navigate to dashboard and return false when user is authenticated', (done) => {
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
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = redirectIfLoggedInGuard({} as any, {} as any);

      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
          done();
        });
      } else {
        expect(result).toBe(false);
        done();
      }
    });
  });

  it('should return true and not navigate when user is not authenticated', (done) => {
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
          useValue: RouterMockBuilder.create().build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    runInInjectionContext(TestBed, () => {
      const result = redirectIfLoggedInGuard({} as any, {} as any);

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
});
