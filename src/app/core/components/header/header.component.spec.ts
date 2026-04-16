import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { UserSelectors } from '@osf/core/store/user';
import { UserModel } from '@osf/shared/models/user/user.model';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerMock: RouterMockType;
  let authServiceMock: AuthServiceMockType;

  beforeEach(() => {
    routerMock = RouterMockBuilder.create().withNavigate(vi.fn().mockResolvedValue(true)).build();
    authServiceMock = AuthServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [HeaderComponent, MockComponent(BreadcrumbComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(AuthService, authServiceMock),
        provideMockStore({
          signals: [{ selector: UserSelectors.getCurrentUser, value: MOCK_USER as UserModel }],
        }),
      ],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose current user from selector', () => {
    expect(component.currentUser()).toEqual(MOCK_USER);
  });

  it('should include expected menu items', () => {
    expect(component.items.map((item) => item.label)).toEqual([
      'navigation.myProfile',
      'navigation.settings',
      'navigation.logOut',
    ]);
  });

  it('should navigate to profile when profile command is executed', () => {
    component.items[0].command?.();
    expect(routerMock.navigate).toHaveBeenCalledWith(['profile']);
  });

  it('should navigate to settings when settings command is executed', () => {
    component.items[1].command?.();
    expect(routerMock.navigate).toHaveBeenCalledWith(['settings']);
  });

  it('should logout when logout command is executed', () => {
    component.items[2].command?.();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should delegate sign in navigation to auth service', () => {
    component.navigateToSignIn();
    expect(authServiceMock.navigateToSignIn).toHaveBeenCalled();
  });
});
