import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Navigation, Router, UrlTree } from '@angular/router';

import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

import { Addon } from '../entities/addons.entities';
import { CredentialsFormat } from '../entities/credentials-format.enum';
import { AddonsSelectors } from '../store';

import { ConnectAddonComponent } from './connect-addon.component';

describe('ConnectAddonComponent', () => {
  let component: ConnectAddonComponent;
  let fixture: ComponentFixture<ConnectAddonComponent>;

  const mockAddon: Addon = {
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
      imports: [ConnectAddonComponent, MockComponent(SubHeaderComponent), MockPipe(TranslatePipe)],
      providers: [
        provideNoopAnimations(),
        MockProvider(Store, {
          selectSignal: jest.fn().mockImplementation((selector) => {
            if (selector === AddonsSelectors.getAddonUserReference) {
              return () => [{ id: 'test-user-id' }];
            }
            if (selector === AddonsSelectors.getCreatedOrUpdatedStorageAddon) {
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

    fixture = TestBed.createComponent(ConnectAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with addon data from router state', () => {
    expect(component).toBeTruthy();
    expect(component['addon']()).toEqual(mockAddon);
    expect(component['terms']().length).toBeGreaterThan(0);
    expect(component['addonForm']).toBeTruthy();
  });
});
