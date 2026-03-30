import { MockProvider } from 'ng-mocks';

import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { UserSelectors } from '@core/store/user';

import { preprintsModeratorGuard } from './preprints-moderator.guard';

import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('preprintsModeratorGuard', () => {
  let routerMock: RouterMockType;
  const routeSnapshot = {} as ActivatedRouteSnapshot;
  const stateSnapshot = {} as RouterStateSnapshot;

  function setup(canViewReviews: boolean) {
    const urlTree = {} as UrlTree;

    routerMock = RouterMockBuilder.create().withCreateUrlTree(jest.fn().mockReturnValue(urlTree)).build();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: UserSelectors.getCanViewReviews, value: canViewReviews }],
        }),
        MockProvider(Router, routerMock),
      ],
    });

    return { urlTree };
  }

  it('should allow activation when user can view reviews', () => {
    setup(true);

    const result = runInInjectionContext(TestBed, () => preprintsModeratorGuard(routeSnapshot, stateSnapshot));

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should return forbidden UrlTree when user cannot view reviews', () => {
    const { urlTree } = setup(false);

    const result = runInInjectionContext(TestBed, () => preprintsModeratorGuard(routeSnapshot, stateSnapshot));

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
    expect(result).toBe(urlTree);
  });
});
