import { provideStore, Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { CookieConsentBannerComponent } from '@core/components/osf-banners/cookie-consent-banner/cookie-consent-banner.component';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser, UserState } from '@core/store/user';
import { UserEmailsState } from '@core/store/user-emails';

import { TranslateServiceMock } from '../testing/mocks/translate.service.mock';

import { FullScreenLoaderComponent } from './shared/components/full-screen-loader/full-screen-loader.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CustomDialogService } from './shared/services/custom-dialog.service';
import { AppComponent } from './app.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

describe('Component: App', () => {
  let routerEvents$: Subject<any>;
  let gtmServiceMock: jest.Mocked<GoogleTagManagerService>;
  let fixture: ComponentFixture<AppComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
    routerEvents$ = new Subject();

    gtmServiceMock = {
      pushTag: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        OSFTestingModule,
        AppComponent,
        ...MockComponents(ToastComponent, FullScreenLoaderComponent, CookieConsentBannerComponent),
      ],
      providers: [
        provideStore([UserState, UserEmailsState]),
        MockProvider(CustomDialogService, mockCustomDialogService),
        TranslateServiceMock,
        { provide: GoogleTagManagerService, useValue: gtmServiceMock },
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  describe('detect changes', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch GetCurrentUser action on initialization', () => {
      const store = TestBed.inject(Store);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      store.dispatch(GetCurrentUser);
      expect(dispatchSpy).toHaveBeenCalledWith(GetCurrentUser);
    });

    it('should render router outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });
  });

  describe('Google Tag Manager', () => {
    it('should push GTM tag on NavigationEnd with google tag id', () => {
      fixture.detectChanges();
      const event = new NavigationEnd(1, '/previous', '/current');

      routerEvents$.next(event);

      expect(gtmServiceMock.pushTag).toHaveBeenCalledWith({
        event: 'page',
        pageName: '/current',
      });
    });

    it('should not push GTM tag on NavigationEnd without google tag id', () => {
      const environment = TestBed.inject(ENVIRONMENT);
      environment.googleTagManagerId = '';
      fixture.detectChanges();
      const event = new NavigationEnd(1, '/previous', '/current');

      routerEvents$.next(event);

      expect(gtmServiceMock.pushTag).not.toHaveBeenCalled();
    });
  });
});
