import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AddonsService } from './addons.service';

import { getAddonsAuthorizedStorageData } from '@testing/data/addons/addons.authorized-storage.data';
import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Service: Addons', () => {
  let service: AddonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule],
      providers: [AddonsService],
    });

    service = TestBed.inject(AddonsService);
  });

  it('should test getAddons', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results: any[] = [];
    service.getAddons('storage').subscribe((result) => {
      results = result;
    });

    const request = httpMock.expectOne('https://addons.staging4.osf.io/v1/external-storage-services');
    expect(request.request.method).toBe('GET');
    request.flush(getAddonsExternalStorageData());

    expect(results[0]).toEqual(
      Object({
        authUrl: 'https://figshare.com/account/applications/authorize',
        credentialsFormat: 'OAUTH2',
        displayName: 'figshare',
        externalServiceName: 'figshare',
        id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
        providerName: 'figshare',
        supportedFeatures: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        type: 'external-storage-services',
        wbKey: 'figshare',
      })
    );

    expect(httpMock.verify).toBeTruthy();
  }));

  it('should test getConfigureAddons', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results: any[] = [];
    service.getConfiguredAddons('storage', 'reference-id').subscribe((result) => {
      results = result;
    });

    const request = httpMock.expectOne(
      'https://addons.staging4.osf.io/v1/resource-references/reference-id/configured_storage_addons/'
    );
    expect(request.request.method).toBe('GET');
    request.flush(getConfiguredAddonsData());

    expect(results[0]).toEqual(
      Object({
        baseAccountId: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
        baseAccountType: 'authorized-storage-accounts',
        connectedCapabilities: ['ACCESS', 'UPDATE'],
        connectedOperationNames: ['list_child_items', 'list_root_items', 'get_item_info'],
        externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
        currentUserIsOwner: true,
        displayName: 'Google Drive',
        externalServiceName: 'googledrive',
        id: '756579dc-3a24-4849-8866-698a60846ac3',
        selectedFolderId: '0AIl0aR4C9JAFUk9PVA',
        type: 'configured-storage-addons',
      })
    );

    expect(httpMock.verify).toBeTruthy();
  }));

  it('should test getAuthorizedStorageOauthToken', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      let results;
      service.getAuthorizedStorageOauthToken('account-id').subscribe((result) => {
        results = result;
      });

      const request = httpMock.expectOne('https://addons.staging4.osf.io/v1/authorized-storage-accounts/account-id');
      expect(request.request.method).toBe('GET');
      request.flush(getAddonsAuthorizedStorageData());

      expect(results).toEqual(
        Object({
          accountOwnerId: '0e761652-ac4c-427e-b31c-7317d53ef32a',
          apiBaseUrl: 'https://www.googleapis.com',
          authUrl: null,
          authorizedCapabilities: ['ACCESS', 'UPDATE'],
          authorizedOperationNames: ['list_root_items', 'get_item_info', 'list_child_items'],
          credentialsAvailable: true,
          credentialsFormat: '',
          defaultRootFolder: '',
          displayName: 'Google Drive',
          externalServiceName: '',
          oauthToken: 'ya29.A0AS3H6NzDCKgrUx',
          externalStorageServiceId: '986c6ba5-ff9b-4a57-8c01-e58ff4cd48ca',
          id: '0ab44840-5a37-4a79-9e94-9b5f5830159a',
          providerName: '',
          supportedFeatures: [],
          type: 'authorized-storage-accounts',
        })
      );

      expect(httpMock.verify).toBeTruthy();
    }
  ));
});
