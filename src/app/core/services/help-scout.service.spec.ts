import { Store } from '@ngxs/store';

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/factory/window.factory';
import { UserSelectors } from '@core/store/user/user.selectors';

import { HelpScoutService } from './help-scout.service';

describe('HelpScoutService', () => {
  let storeMock: Partial<Store>;
  let service: HelpScoutService;
  let mockWindow: any;
  const authSignal = signal(false);

  beforeEach(() => {
    mockWindow = {
      dataLayer: {},
    };

    storeMock = {
      selectSignal: jest.fn().mockImplementation((selector) => {
        if (selector === UserSelectors.isAuthenticated) {
          return authSignal;
        }
        return signal(null); // fallback
      }),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: mockWindow }, HelpScoutService, { provide: Store, useValue: storeMock }],
    });

    service = TestBed.inject(HelpScoutService);
  });

  it('should initialize dataLayer with default values', () => {
    expect(mockWindow.dataLayer).toEqual({
      loggedIn: false,
      resourceType: undefined,
    });
  });

  it('should set the resourceType', () => {
    service.setResourceType('project');
    expect(mockWindow.dataLayer.resourceType).toBe('project');
  });

  it('should unset the resourceType', () => {
    service.setResourceType('node');
    service.unsetResourceType();
    expect(mockWindow.dataLayer.resourceType).toBeUndefined();
  });

  it('should set loggedIn to true or false', () => {
    authSignal.set(true);
    TestBed.flushEffects();
    expect(mockWindow.dataLayer.loggedIn).toBeTruthy();

    authSignal.set(false);
    TestBed.flushEffects();
    expect(mockWindow.dataLayer.loggedIn).toBeFalsy();
  });
});
