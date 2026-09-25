import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AddonType } from '@shared/enums/addon-type.enum';
import { StorageItem } from '@shared/models/addons/storage-item.model';
import { GoogleFileDataModel } from '@shared/models/files/google-file-data.model';
import { GoogleFilePickerModel } from '@shared/models/files/google-file-picker.model';
import { GoogleFilePickerDownloadService } from '@shared/services/google-file-picker.download.service';
import { AddonsSelectors, GetAuthorizedStorageOauthToken } from '@shared/stores/addons';

import { setupGooglePickerMock } from '@testing/mocks/google-picker.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  GoogleFilePickerDownloadServiceMockBuilder,
  GoogleFilePickerDownloadServiceMockType,
} from '@testing/providers/google-file-picker-download.service.mock';
import { SentryMock, SentryMockType } from '@testing/providers/sentry-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { GoogleFilePickerComponent } from './google-file-picker.component';

describe('GoogleFilePickerComponent', () => {
  let fixture: ComponentFixture<GoogleFilePickerComponent>;
  let component: GoogleFilePickerComponent;
  let store: Store;
  let sentryMock: SentryMockType;
  let googlePickerDownloadServiceMock: GoogleFilePickerDownloadServiceMockType;
  let pickerBuilderMock: ReturnType<typeof setupGooglePickerMock>['pickerBuilderMock'];
  let pickerSetVisibleMock: ReturnType<typeof setupGooglePickerMock>['pickerSetVisibleMock'];

  const registeredPickerCallback = (): ((data: GoogleFilePickerModel) => void) | undefined => {
    const callback = pickerBuilderMock.setCallback.mock.calls.at(-1)?.[0];
    return typeof callback === 'function' ? callback : undefined;
  };

  const rootFolder: StorageItem = {
    itemId: 'root-folder-id',
    itemName: 'Root Folder',
  };

  const setup = (options?: {
    accountId?: string;
    isFolderPicker?: boolean;
    googleFilePickerApiKey?: string;
    oauthToken?: string;
    detectChanges?: boolean;
  }) => {
    sentryMock = SentryMock.simple();
    googlePickerDownloadServiceMock = GoogleFilePickerDownloadServiceMockBuilder.create().build();
    ({ pickerBuilderMock, pickerSetVisibleMock } = setupGooglePickerMock());

    const authorizedStorageAddons = options?.oauthToken
      ? [{ id: options.accountId ?? '', oauthToken: options.oauthToken }]
      : [];

    TestBed.configureTestingModule({
      imports: [GoogleFilePickerComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [{ selector: AddonsSelectors.getAuthorizedStorageAddons, value: signal(authorizedStorageAddons) }],
        }),
        { provide: SENTRY_TOKEN, useValue: sentryMock },
        MockProvider(GoogleFilePickerDownloadService, googlePickerDownloadServiceMock),
        MockProvider(ENVIRONMENT, {
          googleFilePickerApiKey: options?.googleFilePickerApiKey ?? 'test-api-key',
          googleFilePickerAppId: 123456789,
        }),
      ],
    });

    fixture = TestBed.createComponent(GoogleFilePickerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.componentRef.setInput('isFolderPicker', options?.isFolderPicker ?? false);
    fixture.componentRef.setInput('rootFolder', rootFolder);
    fixture.componentRef.setInput('accountId', options?.accountId ?? '');
    fixture.componentRef.setInput('currentAddonType', AddonType.STORAGE);
    if (options?.detectChanges !== false) {
      fixture.detectChanges();
    }
  };

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should disable picker when configuration is missing', () => {
    setup({ googleFilePickerApiKey: '' });

    expect(component.isGFPDisabled()).toBe(true);
    expect(googlePickerDownloadServiceMock.loadScript).not.toHaveBeenCalled();
  });

  it('should initialize and set folder picker visible on init', () => {
    setup({ isFolderPicker: true });

    expect(googlePickerDownloadServiceMock.loadScript).toHaveBeenCalled();
    expect(googlePickerDownloadServiceMock.loadGapiModules).toHaveBeenCalled();
    expect(component.visible()).toBe(true);
  });

  it('should capture Sentry error when script loading fails', () => {
    setup({ detectChanges: false });
    const error = new Error('script fail');
    googlePickerDownloadServiceMock.loadScript.mockReturnValue(throwError(() => error));

    fixture.detectChanges();

    expect(sentryMock.captureException).toHaveBeenCalledWith(error, { tags: { feature: 'google-picker load' } });
  });

  it('should capture Sentry error when gapi modules loading fails', () => {
    setup({ detectChanges: false });
    const error = new Error('gapi fail');
    googlePickerDownloadServiceMock.loadGapiModules.mockReturnValue(throwError(() => error));

    fixture.detectChanges();

    expect(sentryMock.captureException).toHaveBeenCalledWith(error, { tags: { feature: 'google-picker auth' } });
  });

  it('should dispatch token action and open picker for account id', () => {
    setup({ accountId: 'account-1', oauthToken: 'oauth-token' });

    component.createPicker();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAuthorizedStorageOauthToken('account-1', AddonType.STORAGE));
    expect(component.isGFPDisabled()).toBe(false);
    expect(pickerBuilderMock.setOAuthToken).toHaveBeenCalledWith('oauth-token');
    expect(pickerSetVisibleMock).toHaveBeenCalledWith(true);
  });

  it('should send selected item to handleFolderSelection on PICKED action', () => {
    setup({ accountId: 'account-1', oauthToken: 'oauth-token' });
    const handleFolderSelection = vi.fn();
    fixture.componentRef.setInput('handleFolderSelection', handleFolderSelection);
    fixture.detectChanges();

    const selectedDoc: GoogleFileDataModel = {
      name: 'Google Doc',
      id: 42,
    };

    component.createPicker();
    registeredPickerCallback()?.({
      action: 'picked',
      docs: [selectedDoc],
    });

    expect(handleFolderSelection).toHaveBeenCalledWith({
      itemName: 'Google Doc',
      itemId: '42',
    });
  });

  it('should ignore callback when action is not PICKED', () => {
    setup({ accountId: 'account-1', oauthToken: 'oauth-token' });
    const handleFolderSelection = vi.fn();
    fixture.componentRef.setInput('handleFolderSelection', handleFolderSelection);
    fixture.detectChanges();

    component.createPicker();
    registeredPickerCallback()?.({
      action: 'cancel',
      docs: [{ name: 'Google Doc', id: 42 }],
    });

    expect(handleFolderSelection).not.toHaveBeenCalled();
  });
});
