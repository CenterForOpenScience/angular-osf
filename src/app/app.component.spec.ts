import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';
import { AccountEmailModel } from '@osf/shared/models/emails/account-email.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock, provideLoaderServiceMock } from '@testing/providers/loader-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { ConfirmEmailComponent } from './shared/components/confirm-email/confirm-email.component';
import { FullScreenLoaderComponent } from './shared/components/full-screen-loader/full-screen-loader.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AppComponent } from './app.component';

import { GoogleTagManagerService } from 'angular-google-tag-manager';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: Store;
  let routerBuilder: RouterMockBuilder;
  let routerMock: RouterMockType;
  let loaderServiceMock: LoaderServiceMock;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let gtmServiceMock: { pushTag: Mock };

  const unverifiedEmail: AccountEmailModel = {
    id: 'email-1',
    emailAddress: 'test@example.com',
    confirmed: false,
    verified: false,
    primary: false,
    isMerge: false,
  };

  interface SetupOverrides extends BaseSetupOverrides {
    isBrowser?: boolean;
    unverifiedEmails?: AccountEmailModel[];
    googleTagManagerId?: string;
  }

  function setup(overrides: SetupOverrides = {}) {
    routerBuilder = RouterMockBuilder.create().withUrl('/home');
    routerMock = routerBuilder.build();
    loaderServiceMock = new LoaderServiceMock();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    gtmServiceMock = { pushTag: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AppComponent, ...MockComponents(ToastComponent, FullScreenLoaderComponent)],
      providers: [
        provideOSFCore(),
        provideLoaderServiceMock(loaderServiceMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(GoogleTagManagerService, gtmServiceMock),
        MockProvider(PLATFORM_ID, overrides.isBrowser === false ? 'server' : 'browser'),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              {
                selector: UserEmailsSelectors.getUnverifiedEmails,
                value: overrides.unverifiedEmails ?? [],
              },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    if (overrides.googleTagManagerId !== undefined) {
      const environment = TestBed.inject(ENVIRONMENT);
      environment.googleTagManagerId = overrides.googleTagManagerId;
    }

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should dispatch current user and emails on init', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new GetCurrentUser());
    expect(store.dispatch).toHaveBeenCalledWith(new GetEmails());
  });

  it('should open confirm email dialog when unverified emails exist', () => {
    setup({ unverifiedEmails: [unverifiedEmail] });
    expect(customDialogServiceMock.open).toHaveBeenCalledWith(
      ConfirmEmailComponent,
      expect.objectContaining({
        header: 'home.confirmEmail.add.title',
        width: '448px',
        data: [unverifiedEmail],
      })
    );
  });

  it('should show loader on navigation start in browser', () => {
    setup();
    routerBuilder.emit(new NavigationStart(1, '/project/1'));
    fixture.detectChanges();
    expect(loaderServiceMock.show).toHaveBeenCalled();
  });

  it('should hide loader after navigation end delay in browser', () => {
    vi.useFakeTimers();
    setup();

    routerBuilder.emit(new NavigationEnd(2, '/a', '/a'));

    expect(loaderServiceMock.hide).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    fixture.detectChanges();

    expect(loaderServiceMock.hide).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should push GTM page event on navigation end when id exists', () => {
    setup({ googleTagManagerId: 'GTM-TEST' });
    routerBuilder.emit(new NavigationEnd(3, '/preprints', '/preprints/osf/1'));
    fixture.detectChanges();
    expect(gtmServiceMock.pushTag).toHaveBeenCalledWith({
      event: 'page',
      pageName: '/preprints/osf/1',
    });
  });

  it('should not subscribe to router events on server', () => {
    setup({ isBrowser: false });
    routerBuilder.emit(new NavigationStart(4, '/x'));
    routerBuilder.emit(new NavigationEnd(5, '/x', '/x'));
    fixture.detectChanges();
    expect(loaderServiceMock.show).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
    expect(gtmServiceMock.pushTag).not.toHaveBeenCalled();
  });
});
