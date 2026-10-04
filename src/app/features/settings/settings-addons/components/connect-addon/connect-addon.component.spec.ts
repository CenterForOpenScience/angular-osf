import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AddonSetupAccountFormComponent } from '@osf/shared/components/addons/addon-setup-account-form/addon-setup-account-form.component';
import { AddonTermsComponent } from '@osf/shared/components/addons/addon-terms/addon-terms.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { AuthorizedAccountType } from '@osf/shared/enums/addon-type.enum';
import { AddonCategory } from '@osf/shared/enums/addons-category.enum';
import { AuthorizedAddonRequestJsonApi } from '@osf/shared/models/addons/authorized-addon-json-api.model';
import { AddonOAuthService } from '@osf/shared/services/addons/addon-oauth.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { AddonModel } from '@shared/models/addons/addon.model';
import { AuthorizedAccountModel } from '@shared/models/addons/authorized-account.model';
import { AddonsSelectors, CreateAuthorizedAddon, UpdateAuthorizedAddon } from '@shared/stores/addons';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { ConnectAddonComponent } from './connect-addon.component';

interface SetupOverrides {
  addon?: AddonModel | AuthorizedAccountModel;
  createdAccount?: AuthorizedAccountModel;
}

describe('ConnectAddonComponent', () => {
  const storageAddon: AddonModel = { ...MOCK_ADDON, type: AddonCategory.EXTERNAL_STORAGE_SERVICES };

  const authorizedAccount: AuthorizedAccountModel = {
    ...MOCK_ADDON,
    type: AuthorizedAccountType.STORAGE,
    id: 'account-id',
    displayName: 'My account',
    authUrl: null,
    authorizedCapabilities: ['ACCESS', 'UPDATE'],
    authorizedOperationNames: ['list_root_items'],
    credentialsAvailable: true,
    apiBaseUrl: '',
    defaultRootFolder: '',
    oauthToken: '',
    accountOwnerId: 'user-reference-id',
    externalStorageServiceId: 'service-id',
  };

  const payload: AuthorizedAddonRequestJsonApi = {
    data: {
      type: AuthorizedAccountType.STORAGE,
      attributes: {
        api_base_url: '',
        auth_url: null,
        authorized_capabilities: ['ACCESS', 'UPDATE'],
        credentials: {},
        credentials_available: false,
        display_name: 'My account',
        initiate_oauth: false,
      },
      relationships: {
        account_owner: { data: { type: 'user-references', id: 'user-reference-id' } },
        external_storage_service: { data: { type: 'external-storage-services', id: 'service-id' } },
      },
    },
  };

  function setup(overrides: SetupOverrides = {}) {
    const addon = overrides.addon ?? storageAddon;
    const toastService = ToastServiceMock.simple();
    const mockRouter = {
      ...RouterMockBuilder.create().withUrl('/settings/addons/connect-addon').build(),
      getCurrentNavigation: vi.fn().mockReturnValue({ extras: { state: { addon } } }),
    };

    TestBed.configureTestingModule({
      imports: [
        ConnectAddonComponent,
        ...MockComponents(SubHeaderComponent, AddonTermsComponent, AddonSetupAccountFormComponent),
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: AddonsSelectors.getAddonsUserReference, value: [{ id: 'user-reference-id', userUri: '' }] },
            {
              selector: AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon,
              value: overrides.createdAccount ?? authorizedAccount,
            },
          ],
        }),
        MockProvider(Router, mockRouter),
        MockProvider(ToastService, toastService),
        MockProvider(AddonOAuthService, { startOAuthTracking: vi.fn(), stopOAuthTracking: vi.fn() }),
      ],
    });

    const store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(ConnectAddonComponent);
    fixture.detectChanges();

    return { component: fixture.componentInstance, store, toastService, mockRouter };
  }

  it('should create and initialize with addon data from router state', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.addon()).toEqual(storageAddon);
  });

  it('should create the authorized addon and return to the addons list', () => {
    const { component, store, mockRouter } = setup();

    component.handleConnectAuthorizedAddon(payload);

    expect(store.dispatch).toHaveBeenCalledWith(new CreateAuthorizedAddon(payload, 'storage'));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings/addons'], {
      queryParams: { activeTab: 1, addonType: 'storage' },
    });
  });

  it('should update the authorized addon when the page was opened for an account', () => {
    const { component, store } = setup({ addon: authorizedAccount });

    component.handleConnectAuthorizedAddon(payload);

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateAuthorizedAddon(payload, 'storage', 'account-id'));
  });

  it('should name a built-in service in the success toast', () => {
    const { component, toastService } = setup({
      createdAccount: { ...authorizedAccount, externalServiceName: 'dropbox' },
    });

    component.handleConnectAuthorizedAddon(payload);

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.addons.toast.createSuccess', {
      addonName: 'Dropbox',
    });
  });

  it('should fall back to the provider name of the addon being connected when the service has no built-in name', () => {
    const { component, toastService } = setup({
      addon: { ...storageAddon, externalServiceName: 's3compat', providerName: 'S3 Compatible Storage' },
      createdAccount: { ...authorizedAccount, externalServiceName: 's3compat', providerName: '' },
    });

    component.handleConnectAuthorizedAddon(payload);

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.addons.toast.createSuccess', {
      addonName: 'S3 Compatible Storage',
    });
  });

  it('should fall back to the provider name of the updated account when the page was opened for an account', () => {
    const { component, toastService } = setup({
      addon: { ...authorizedAccount, externalServiceName: 's3compat', providerName: '' },
      createdAccount: { ...authorizedAccount, externalServiceName: 's3compat', providerName: 'S3 Compatible Storage' },
    });

    component.handleConnectAuthorizedAddon(payload);

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.addons.toast.createSuccess', {
      addonName: 'S3 Compatible Storage',
    });
  });
});
