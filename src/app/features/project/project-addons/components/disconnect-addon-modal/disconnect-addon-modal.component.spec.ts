import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredAddonType } from '@osf/shared/enums/addon-type.enum';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { AddonsSelectors, DeleteConfiguredAddon } from '@osf/shared/stores/addons';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { DisconnectAddonModalComponent } from './disconnect-addon-modal.component';

describe('DisconnectAddonModalComponent', () => {
  let component: DisconnectAddonModalComponent;
  let fixture: ComponentFixture<DisconnectAddonModalComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  const storageAddon: ConfiguredAddonModel = {
    ...MOCK_CONFIGURED_ADDON,
    type: ConfiguredAddonType.STORAGE,
  };

  const linkAddon: ConfiguredAddonModel = {
    ...MOCK_CONFIGURED_ADDON,
    type: ConfiguredAddonType.LINK,
  };

  const defaultSignals: SignalOverride[] = [
    { selector: AddonsSelectors.getDeleteStorageAddonSubmitting, value: false },
    { selector: AddonsSelectors.getSelectedStorageItem, value: { itemName: 'Research Folder' } },
  ];

  interface SetupOverrides extends BaseSetupOverrides {
    addon?: ConfiguredAddonModel | null;
    message?: string;
    omitMessage?: boolean;
    detectChanges?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    const addon = overrides.addon === undefined ? storageAddon : overrides.addon;
    const data = overrides.omitMessage ? { addon } : { addon, message: overrides.message ?? 'Disconnect this addon?' };
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [DisconnectAddonModalComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data }),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(DisconnectAddonModalComponent);
    component = fixture.componentInstance;

    if (overrides.detectChanges !== false) {
      fixture.detectChanges();
    }
  }

  it('should read addon and message from dialog config', () => {
    setup();

    expect(component.addon).toEqual(storageAddon);
    expect(component.dialogMessage).toBe('Disconnect this addon?');
  });

  it('should use an empty message when dialog data omits it', () => {
    setup({ omitMessage: true });

    expect(component.dialogMessage).toBe('');
  });

  it('should label the selected item as a folder for storage addons', () => {
    setup();

    expect(component.selectedItemLabel()).toBe('settings.addons.configureAddon.selectedFolder');
  });

  it('should label the selected item as a linked item for link addons', () => {
    setup({ addon: linkAddon });

    expect(component.selectedItemLabel()).toBe('settings.addons.configureAddon.linkedItem');
  });

  it('should expose submitting state and the selected folder from the store', () => {
    setup({
      selectorOverrides: [
        { selector: AddonsSelectors.getDeleteStorageAddonSubmitting, value: true },
        { selector: AddonsSelectors.getSelectedStorageItem, value: { itemName: 'Shared Drive' } },
      ],
    });

    expect(component.isSubmitting()).toBe(true);
    expect(component.selectedFolder()?.itemName).toBe('Shared Drive');
  });

  it('should render the message, account name, and selected folder', () => {
    setup();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Disconnect this addon?');
    expect(text).toContain(storageAddon.displayName);
    expect(text).toContain('Research Folder');
  });

  it('should disable actions while disconnect is submitting', () => {
    setup({
      selectorOverrides: [{ selector: AddonsSelectors.getDeleteStorageAddonSubmitting, value: true }],
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
  });

  it('should delete the configured addon and close with success', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleDisconnectAddonAccount();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteConfiguredAddon(storageAddon.id, storageAddon.type));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
  });

  it('should not delete when the addon is missing', () => {
    setup({ addon: null, detectChanges: false });
    (store.dispatch as Mock).mockClear();

    component.handleDisconnectAddonAccount();

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close without a result when cancel is clicked', () => {
    setup();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
