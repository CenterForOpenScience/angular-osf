import { provideStore, Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser, UserState } from '@core/store/user';
import { UserEmailsState } from '@core/store/user-emails';

import { CookieConsentComponent, FullScreenLoaderComponent, ToastComponent } from './shared/components';
import { TranslateServiceMock } from './shared/mocks';
import { AppComponent } from './app.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

describe('Component: App', () => {
  let routerEvents$: Subject<any>;
  let gtmServiceMock: jest.Mocked<GoogleTagManagerService>;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    gtmServiceMock = {
      pushTag: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        OSFTestingModule,
        AppComponent,
        ...MockComponents(ToastComponent, FullScreenLoaderComponent, CookieConsentComponent),
      ],
      providers: [
        provideStore([UserState, UserEmailsState]),
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
