import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AddonType } from '@shared/enums/addon-type.enum';
import { StorageItem } from '@shared/models/addons/storage-item.model';
import { GoogleFileDataModel } from '@shared/models/files/google-file.data.model';
import { GoogleFilePickerDownloadService } from '@shared/services/google-file-picker.download.service';
import { GetAuthorizedStorageOauthToken } from '@shared/stores/addons';

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

  const rootFolder: StorageItem = {
    itemId: 'root-folder-id',
    itemName: 'Root Folder',
  };

  const setup = (options?: { accountId?: string; isFolderPicker?: boolean; googleFilePickerApiKey?: string }) => {
    sentryMock = SentryMock.simple();
    googlePickerDownloadServiceMock = GoogleFilePickerDownloadServiceMockBuilder.create().build();
    ({ pickerBuilderMock, pickerSetVisibleMock } = setupGooglePickerMock());

    TestBed.configureTestingModule({
      imports: [GoogleFilePickerComponent],
      providers: [
        provideOSFCore(),
        provideMockStore(),
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
    fixture.detectChanges();
  };

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should disable picker when configuration is missing', () => {
    setup({ googleFilePickerApiKey: '' });

    component.ngOnInit();

    expect(component.isGFPDisabled()).toBe(true);
    expect(googlePickerDownloadServiceMock.loadScript).not.toHaveBeenCalled();
  });

  it('should initialize and set folder picker visible on init', () => {
    setup({ isFolderPicker: true });

    component.ngOnInit();

    expect(googlePickerDownloadServiceMock.loadScript).toHaveBeenCalled();
    expect(googlePickerDownloadServiceMock.loadGapiModules).toHaveBeenCalled();
    expect(component.visible()).toBe(true);
  });

  it('should capture Sentry error when script loading fails', () => {
    setup();
    const error = new Error('script fail');
    googlePickerDownloadServiceMock.loadScript.mockReturnValue(throwError(() => error));

    component.ngOnInit();

    expect(sentryMock.captureException).toHaveBeenCalledWith(error, { tags: { feature: 'google-picker load' } });
  });

  it('should capture Sentry error when gapi modules loading fails', () => {
    setup();
    const error = new Error('gapi fail');
    googlePickerDownloadServiceMock.loadGapiModules.mockReturnValue(throwError(() => error));

    component.ngOnInit();

    expect(sentryMock.captureException).toHaveBeenCalledWith(error, { tags: { feature: 'google-picker auth' } });
  });

  it('should dispatch token action and open picker for account id', () => {
    setup({ accountId: 'account-1' });
    vi.spyOn(store, 'selectSnapshot').mockReturnValue('oauth-token');

    component.ngOnInit();
    component.createPicker();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAuthorizedStorageOauthToken('account-1', AddonType.STORAGE));
    expect(component.accessToken()).toBe('oauth-token');
    expect(component.isGFPDisabled()).toBe(false);
    expect(pickerBuilderMock.setOAuthToken).toHaveBeenCalledWith('oauth-token');
    expect(pickerSetVisibleMock).toHaveBeenCalledWith(true);
  });

  it('should send selected item to handleFolderSelection on PICKED action', () => {
    setup();
    const handleFolderSelection = vi.fn();
    fixture.componentRef.setInput('handleFolderSelection', handleFolderSelection);
    fixture.detectChanges();

    const selectedDoc: GoogleFileDataModel = {
      name: 'Google Doc',
      id: 42,
    };

    component.pickerCallback({
      action: 'picked',
      docs: [selectedDoc],
    });

    expect(handleFolderSelection).toHaveBeenCalledWith({
      itemName: 'Google Doc',
      itemId: 42,
    });
  });

  it('should ignore callback when action is not PICKED', () => {
    setup();
    const handleFolderSelection = vi.fn();
    fixture.componentRef.setInput('handleFolderSelection', handleFolderSelection);
    fixture.detectChanges();

    component.pickerCallback({
      action: 'cancel',
      docs: [{ name: 'Google Doc', id: 42 }],
    });

    expect(handleFolderSelection).not.toHaveBeenCalled();
  });
});
