import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AddonSetupAccountFormComponent } from '@osf/shared/components/addons/addon-setup-account-form/addon-setup-account-form.component';
import { StorageItemSelectorComponent } from '@osf/shared/components/addons/storage-item-selector/storage-item-selector.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CredentialsFormat } from '@osf/shared/enums/addons-credentials-format.enum';
import { AddonModel } from '@osf/shared/models/addons/addon.model';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ConnectConfiguredAddonComponent,
        ...MockComponents(SubHeaderComponent, AddonSetupAccountFormComponent, StorageItemSelectorComponent),
      ],
      providers: [provideOSFCore(), provideMockStore(), MockProvider(Router), MockProvider(ActivatedRoute)],
    });

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
