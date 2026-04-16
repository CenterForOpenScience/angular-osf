import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ApplicationRef, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/provider/window.provider';
import { UserSelectors } from '@core/store/user';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { HelpScoutService } from './help-scout.service';

interface DataLayer {
  loggedIn: boolean;
  resourceType: string | undefined;
}

describe('HelpScoutService', () => {
  let service: HelpScoutService;
  let store: Store;
  let applicationRef: ApplicationRef;
  let isAuthenticatedSignal: WritableSignal<boolean>;
  let windowMock: Window & { dataLayer?: DataLayer };

  function setup(overrides?: { isBrowser?: boolean; initialAuth?: boolean; initialDataLayer?: DataLayer }) {
    isAuthenticatedSignal = signal(overrides?.initialAuth ?? false);
    windowMock = { dataLayer: overrides?.initialDataLayer } as Window & { dataLayer?: DataLayer };

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(WINDOW, windowMock),
        MockProvider(PLATFORM_ID, overrides?.isBrowser === false ? 'server' : 'browser'),
        provideMockStore({
          signals: [{ selector: UserSelectors.isAuthenticated, value: isAuthenticatedSignal }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    applicationRef = TestBed.inject(ApplicationRef);
    service = TestBed.inject(HelpScoutService);
  }

  it('should create', () => {
    setup();
    expect(service).toBeTruthy();
    expect(store).toBeTruthy();
  });

  it('should initialize existing dataLayer in browser', () => {
    setup({
      initialDataLayer: { loggedIn: true, resourceType: 'project' },
    });
    expect(windowMock.dataLayer).toEqual({
      loggedIn: false,
      resourceType: undefined,
    });
  });

  it('should create dataLayer when missing in browser', () => {
    setup();
    expect(windowMock.dataLayer).toEqual({
      loggedIn: false,
      resourceType: undefined,
    });
  });

  it('should update loggedIn when authentication signal changes in browser', async () => {
    setup();
    expect(windowMock.dataLayer?.loggedIn).toBe(false);
    isAuthenticatedSignal.set(true);
    await applicationRef.whenStable();
    expect(windowMock.dataLayer?.loggedIn).toBe(true);
  });

  it('should set and unset resourceType in browser', () => {
    setup();
    service.setResourceType('preprint');
    expect(windowMock.dataLayer?.resourceType).toBe('preprint');
    service.unsetResourceType();
    expect(windowMock.dataLayer?.resourceType).toBeUndefined();
  });

  it('should not initialize dataLayer on server', () => {
    setup({ isBrowser: false });
    expect(windowMock.dataLayer).toBeUndefined();
  });

  it('should not set resourceType on server', () => {
    setup({ isBrowser: false });
    service.setResourceType('preprint');
    expect(windowMock.dataLayer).toBeUndefined();
  });
});
