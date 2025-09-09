import { provideStore, Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { Subject } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { GetCurrentUser, UserState } from '@core/store/user';
import { UserEmailsState } from '@core/store/user-emails';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';
import { TranslateServiceMock } from './shared/mocks';
import { AppComponent } from './app.component';

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
      imports: [AppComponent, ...MockComponents(ToastComponent, FullScreenLoaderComponent)],
      providers: [
        provideStore([UserState, UserEmailsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('should push GTM tag on NavigationEnd', () => {
    const event = new NavigationEnd(1, '/previous', '/current');

    routerEvents$.next(event);

    expect(gtmServiceMock.pushTag).toHaveBeenCalledWith({
      event: 'page',
      pageName: '/current',
    });
  });
});
