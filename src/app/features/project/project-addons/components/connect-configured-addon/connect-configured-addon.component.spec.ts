import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Navigation, Router, UrlTree } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components';
import { CredentialsFormat } from '@shared/enums';
import { AddonModel } from '@shared/models';
import { AddonsSelectors } from '@shared/stores/addons';

import { ConnectConfiguredAddonComponent } from './connect-configured-addon.component';

describe.skip('ConnectAddonComponent', () => {
  let component: ConnectConfiguredAddonComponent;
  let fixture: ComponentFixture<ConnectConfiguredAddonComponent>;

  const mockAddon: AddonModel = {
    id: 'test-addon-id',
    type: 'external-storage-services',
    displayName: 'Test Addon',
    credentialsFormat: CredentialsFormat.OAUTH2,
    supportedFeatures: ['ACCESS'],
    providerName: 'Test Provider',
    authUrl: 'https://test.com/auth',
    externalServiceName: 'test-service',
  };

  beforeEach(async () => {
    const mockNavigation: Partial<Navigation> = {
      id: 1,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: 'imperative',
      previousNavigation: null,
      extras: {
        state: { addon: mockAddon },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ConnectConfiguredAddonComponent, MockComponent(SubHeaderComponent), MockPipe(TranslatePipe)],
      providers: [
        provideNoopAnimations(),
        MockProvider(Store, {
          selectSignal: jest.fn().mockImplementation((selector) => {
            if (selector === AddonsSelectors.getAddonsUserReference) {
              return () => [{ id: 'test-user-id' }];
            }
            if (selector === AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon) {
              return () => null;
            }
            return () => null;
          }),
          dispatch: jest.fn().mockReturnValue(of({})),
        }),
        MockProvider(Router, {
          getCurrentNavigation: () => mockNavigation as Navigation,
          navigate: jest.fn(),
        }),
        MockProvider(TranslateService),
        MockProvider(ActivatedRoute),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectConfiguredAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with addon data from router state', () => {
    expect(component).toBeTruthy();
    expect(component['addon']()).toEqual(mockAddon);
    expect(component['terms']().length).toBeGreaterThan(0);
  });
});
