import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AddonsService } from './addons.service';

import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getAddonsExternalStorageData } from '@testing/data/addons/addons.external-storage.data';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Service: Addons', () => {
  let service: AddonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
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
});
