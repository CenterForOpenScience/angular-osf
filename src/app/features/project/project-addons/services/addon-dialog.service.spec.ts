import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { ConfiguredAddonModel } from '@shared/models/addons/configured-addon.model';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { DisconnectAddonModalComponent } from '../components/disconnect-addon-modal/disconnect-addon-modal.component';

import { AddonDialogService } from './addon-dialog.service';

describe('AddonDialogService', () => {
  let service: AddonDialogService;
  let translateService: TranslateService;
  let dialogService: { open: Mock };
  let dialogClose$: Subject<{ success: boolean }>;

  const builtInAddon: ConfiguredAddonModel = {
    ...MOCK_CONFIGURED_ADDON,
    externalServiceName: 'dropbox',
    displayName: 'My Dropbox folder',
  };

  const foreignAddon: ConfiguredAddonModel = {
    ...MOCK_CONFIGURED_ADDON,
    externalServiceName: 's3compat',
    displayName: 'S3 Compatible Storage',
  };

  beforeEach(() => {
    dialogClose$ = new Subject<{ success: boolean }>();
    dialogService = { open: vi.fn().mockReturnValue({ onClose: dialogClose$ }) };

    TestBed.configureTestingModule({
      providers: [provideOSFCore(), MockProvider(DialogService, dialogService)],
    });

    service = TestBed.inject(AddonDialogService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should open the disconnect dialog for the given addon', () => {
    service.openDisconnectDialog(builtInAddon);

    expect(dialogService.open).toHaveBeenCalledTimes(1);
    const [component, config] = dialogService.open.mock.calls[0];
    expect(component).toBe(DisconnectAddonModalComponent);
    expect(config.data.addon).toBe(builtInAddon);
  });

  it('should name a built-in service in the disconnect dialog header', () => {
    service.openDisconnectDialog(builtInAddon);

    expect(translateService.instant).toHaveBeenCalledWith('settings.addons.configureAddon.disconnect', {
      addonName: 'Dropbox',
    });
  });

  it('should fall back to the addon display name when the service has no built-in name', () => {
    service.openDisconnectDialog(foreignAddon);

    expect(translateService.instant).toHaveBeenCalledWith('settings.addons.configureAddon.disconnect', {
      addonName: 'S3 Compatible Storage',
    });
  });

  it('should return the result of the disconnect dialog', () => {
    const results: { success: boolean }[] = [];

    service.openDisconnectDialog(foreignAddon).subscribe((result) => results.push(result));
    dialogClose$.next({ success: true });

    expect(results).toEqual([{ success: true }]);
  });

  it('should throw when the disconnect dialog cannot be opened', () => {
    dialogService.open.mockReturnValue(null);

    expect(() => service.openDisconnectDialog(foreignAddon)).toThrow('common.errorMessages.dialogOpenError');
  });
});
