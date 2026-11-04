import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { CustomMenuItem } from '@core/models/custom-menu-item.model';
import { AuthService } from '@core/services/auth.service';
import { ProviderSelectors } from '@core/store/provider';
import { UserSelectors } from '@core/store/user';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

import { NavMenuComponent } from './nav-menu.component';

interface SetupOverrides extends BaseSetupOverrides {
  routerUrl?: string;
  nestedRouteParams?: Record<string, string>;
  queryParams?: Record<string, string>;
}

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let authServiceMock: AuthServiceMockType;
  let routerMock: RouterMockType;

  function findMenuItem(items: CustomMenuItem[] | undefined, id: string): CustomMenuItem | undefined {
    if (!items) {
      return undefined;
    }

    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      const nested = findMenuItem(item.items, id);
      if (nested) {
        return nested;
      }
    }

    return undefined;
  }

  function setup(overrides: SetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create().withQueryParams(overrides.queryParams ?? {});

    if (overrides.nestedRouteParams) {
      routeBuilder.withFirstChild((featureRoute) => {
        featureRoute.withFirstChild((detailsRoute) => {
          detailsRoute.withParams(overrides.nestedRouteParams ?? {});
        });
      });
    } else if (overrides.routeParams) {
      routeBuilder.withParams(overrides.routeParams);
    }

    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }

    const routeMock = routeBuilder.build();
    routerMock = RouterMockBuilder.create()
      .withUrl(overrides.routerUrl ?? '/')
      .build();
    authServiceMock = AuthServiceMock.simple();

    const defaultSignals = [
      { selector: UserSelectors.isAuthenticated, value: true },
      { selector: UserSelectors.getCanViewReviews, value: false },
      { selector: CurrentResourceSelectors.getCurrentResource, value: null },
      { selector: ProviderSelectors.getCurrentProvider, value: null },
    ];
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [NavMenuComponent],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(Router, routerMock),
        MockProvider(AuthService, authServiceMock),
        MockProvider(ViewOnlyLinkHelperService, ViewOnlyLinkHelperMock.simple()),
        provideMockStore({ signals }),
      ],
    });

    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should detect preprint details from nested route params', () => {
    setup({
      routerUrl: '/preprints/socarxiv/2cpmr_v3',
      nestedRouteParams: { providerId: 'socarxiv', id: '2cpmr_v3' },
    });

    expect(component.isPreprintRoute()).toBe(true);
    expect(component.currentResourceId()).toBe('2cpmr_v3');
  });

  it('should not treat preprint provider overview as preprint details', () => {
    setup({
      routerUrl: '/preprints/socarxiv',
      nestedRouteParams: { providerId: 'socarxiv' },
    });

    expect(component.isPreprintRoute()).toBe(false);
    expect(component.currentResourceId()).toBeUndefined();
  });

  it('should show preprint details menu using nested providerId when provider store is empty', () => {
    setup({
      routerUrl: '/preprints/socarxiv/2cpmr_v3',
      nestedRouteParams: { providerId: 'socarxiv', id: '2cpmr_v3' },
    });

    const detailsItem = findMenuItem(component.mainMenuItems(), 'preprints-details');

    expect(detailsItem?.visible).toBe(true);
    expect(detailsItem?.items?.[0]?.routerLink).toEqual(['preprints', 'socarxiv', '2cpmr_v3']);
  });

  it('should use resourceId from query params when route id is missing', () => {
    setup({
      routerUrl: '/collections/provider-1',
      queryParams: { resourceId: 'query-resource-1' },
    });

    expect(component.currentResourceId()).toBe('query-resource-1');
  });

  it('should emit closeMenu for leaf items', () => {
    setup();
    const closeMenu = vi.fn();
    component.closeMenu.subscribe(closeMenu);

    component.goToLink({ id: 'home', label: 'Home' });

    expect(closeMenu).toHaveBeenCalledTimes(1);
  });

  it('should not emit closeMenu for items with children', () => {
    setup();
    const closeMenu = vi.fn();
    component.closeMenu.subscribe(closeMenu);

    component.goToLink({
      id: 'preprints',
      label: 'Preprints',
      items: [{ id: 'child', label: 'Child', visible: true }],
    });

    expect(closeMenu).not.toHaveBeenCalled();
  });

  it('should navigate to sign in', () => {
    setup();

    component.goToLink({ id: 'sign-in', label: 'Sign in' });

    expect(authServiceMock.navigateToSignIn).toHaveBeenCalledTimes(1);
  });

  it('should log out', () => {
    setup();

    component.goToLink({ id: 'log-out', label: 'Log out' });

    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
  });

  it('should report visible children', () => {
    setup();

    expect(
      component.hasVisibleChildren({
        id: 'parent',
        items: [
          { id: 'hidden', visible: false },
          { id: 'shown', visible: true },
        ],
      })
    ).toBe(true);
    expect(component.hasVisibleChildren({ id: 'leaf' })).toBe(false);
  });
});
