import { MockComponent, MockProvider } from 'ng-mocks';

import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { CustomMenuItem } from '@osf/core/models';
import { ProviderSelectors } from '@osf/core/store/provider/provider.selectors';
import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { NavMenuComponent } from './nav-menu.component';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    Object.defineProperty(window, 'open', {
      writable: true,
      value: jest.fn(),
    });
    mockAuthService = {
      navigateToSignIn: jest.fn(),
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NavMenuComponent, OSFTestingModule, MockComponent(IconComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: UserSelectors.isAuthenticated, value: signal(false) },
            { selector: UserSelectors.getCurrentUser, value: signal(MOCK_USER) },
            { selector: UserSelectors.getCanViewReviews, value: signal(false) },
            { selector: ProviderSelectors.getCurrentProvider, value: signal(null) },
            { selector: CurrentResourceSelectors.getCurrentResource, value: signal(null) },
          ],
        }),
        {
          provide: Router,
          useValue: {
            ...RouterMockBuilder.create().withUrl('/test').build(),
            serializeUrl: jest.fn(() => '/test'),
            parseUrl: jest.fn(() => ({})),
            isActive: jest.fn(() => false),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: ActivatedRouteMockBuilder.create().build(),
        },
        MockProvider(AuthService, mockAuthService),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open external links in new tab for support and donate items', () => {
    const openSpy = jest.spyOn(window, 'open');
    const supportItem: CustomMenuItem = { id: 'support', url: 'https://support.example.com' };
    const donateItem: CustomMenuItem = { id: 'donate', url: 'https://donate.example.com' };

    component.goToLink(supportItem);
    expect(openSpy).toHaveBeenCalledWith('https://support.example.com', '_blank');

    component.goToLink(donateItem);
    expect(openSpy).toHaveBeenCalledWith('https://donate.example.com', '_blank');
  });

  it('should navigate to sign in for sign-in item', () => {
    const signInItem: CustomMenuItem = { id: 'sign-in' };

    component.goToLink(signInItem);
    expect(mockAuthService.navigateToSignIn).toHaveBeenCalled();
  });

  it('should logout for log-out item', () => {
    const logOutItem: CustomMenuItem = { id: 'log-out' };

    component.goToLink(logOutItem);
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should emit closeMenu for items without children', () => {
    const emitSpy = jest.spyOn(component.closeMenu, 'emit');
    const menuItem: CustomMenuItem = { id: 'test-item' };

    component.goToLink(menuItem);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit closeMenu for items with children', () => {
    const emitSpy = jest.spyOn(component.closeMenu, 'emit');
    const menuItemWithChildren: CustomMenuItem = {
      id: 'test-item',
      items: [{ id: 'child-item' }],
    };

    component.goToLink(menuItemWithChildren);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should return false for items without items array', () => {
    const menuItem: CustomMenuItem = { id: 'test-item' };
    expect(component.hasVisibleChildren(menuItem)).toBe(false);
  });

  it('should return false for items with empty items array', () => {
    const menuItem: CustomMenuItem = { id: 'test-item', items: [] };
    expect(component.hasVisibleChildren(menuItem)).toBe(false);
  });

  it('should return false for items with all invisible children', () => {
    const menuItem: CustomMenuItem = {
      id: 'test-item',
      items: [
        { id: 'child1', visible: false },
        { id: 'child2', visible: false },
      ],
    };
    expect(component.hasVisibleChildren(menuItem)).toBe(false);
  });

  it('should return true for items with at least one visible child', () => {
    const menuItem: CustomMenuItem = {
      id: 'test-item',
      items: [
        { id: 'child1', visible: false },
        { id: 'child2', visible: true },
      ],
    };
    expect(component.hasVisibleChildren(menuItem)).toBe(true);
  });

  it('should return false for items with children that have visible property undefined', () => {
    const menuItem: CustomMenuItem = {
      id: 'test-item',
      items: [{ id: 'child1' }],
    };
    expect(component.hasVisibleChildren(menuItem)).toBe(false);
  });

  it('should have mainMenuItems computed property', () => {
    expect(component.mainMenuItems).toBeDefined();
    expect(typeof component.mainMenuItems).toBe('function');
  });

  it('should have currentRoute computed property', () => {
    expect(component.currentRoute).toBeDefined();
  });

  it('should have currentResourceId computed property', () => {
    expect(component.currentResourceId).toBeDefined();
    expect(typeof component.currentResourceId).toBe('function');
  });

  it('should have isCollectionsRoute computed property', () => {
    expect(component.isCollectionsRoute).toBeDefined();
    expect(typeof component.isCollectionsRoute).toBe('function');
  });

  it('should have isPreprintRoute computed property', () => {
    expect(component.isPreprintRoute).toBeDefined();
    expect(typeof component.isPreprintRoute).toBe('function');
  });

  it('should emit closeMenu event', () => {
    const emitSpy = jest.spyOn(component.closeMenu, 'emit');

    component.closeMenu.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
