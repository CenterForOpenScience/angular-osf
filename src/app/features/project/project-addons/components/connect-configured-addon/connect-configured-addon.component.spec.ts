import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { AddonSetupAccountFormComponent } from '@osf/shared/components/addons/addon-setup-account-form/addon-setup-account-form.component';
import { AddonTermsComponent } from '@osf/shared/components/addons/addon-terms/addon-terms.component';
import { StorageItemSelectorComponent } from '@osf/shared/components/addons/storage-item-selector/storage-item-selector.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { AddonCategory } from '@osf/shared/enums/addons-category.enum';
import { AddonModel } from '@osf/shared/models/addons/addon.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { AddonsSelectors, CreateConfiguredAddon } from '@osf/shared/stores/addons';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { ConnectConfiguredAddonComponent } from './connect-configured-addon.component';

describe('ConnectConfiguredAddonComponent', () => {
  const storageAddon: AddonModel = { ...MOCK_ADDON, type: AddonCategory.EXTERNAL_STORAGE_SERVICES };

  function setup(addon: AddonModel = storageAddon) {
    const toastService = ToastServiceMock.simple();
    const mockRouter = {
      ...RouterMockBuilder.create().withUrl('/abc12/addons/connect-addon').build(),
      getCurrentNavigation: vi.fn().mockReturnValue({ extras: { state: { addon } } }),
    };

    TestBed.configureTestingModule({
      imports: [
        ConnectConfiguredAddonComponent,
        ...MockComponents(
          SubHeaderComponent,
          AddonTermsComponent,
          AddonSetupAccountFormComponent,
          StorageItemSelectorComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: AddonsSelectors.getAddonsUserReference, value: [{ id: 'user-reference-id', userUri: '' }] },
            { selector: AddonsSelectors.getCreatedOrUpdatedConfiguredAddon, value: MOCK_CONFIGURED_ADDON },
          ],
        }),
        MockProvider(Router, mockRouter),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().withParams({ id: 'abc12' }).build()),
        MockProvider(ToastService, toastService),
        MockProvider(DialogService),
      ],
    });

    const store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(ConnectConfiguredAddonComponent);
    fixture.detectChanges();

    return { component: fixture.componentInstance, store, toastService, mockRouter };
  }

  it('should create and initialize with addon data from router state', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.addon()).toEqual(storageAddon);
  });

  it('should create the configured addon and return to the addons list', () => {
    const { component, store, mockRouter } = setup();

    component.handleCreateConfiguredAddon();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(CreateConfiguredAddon));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/abc12/addons'], {
      queryParams: { activeTab: 1, addonType: 'storage' },
    });
  });

  it('should name a built-in service in the success toast', () => {
    const { component, toastService } = setup({ ...storageAddon, externalServiceName: 'dropbox' });

    component.handleCreateConfiguredAddon();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.addons.toast.createSuccess', {
      addonName: 'Dropbox',
    });
  });

  it('should fall back to the provider name in the success toast when the service has no built-in name', () => {
    const { component, toastService } = setup({
      ...storageAddon,
      externalServiceName: 's3compat',
      providerName: 'S3 Compatible Storage',
    });

    component.handleCreateConfiguredAddon();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.addons.toast.createSuccess', {
      addonName: 'S3 Compatible Storage',
    });
  });
});
