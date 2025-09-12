import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { FilesService } from './files.service';

import { getConfiguredAddonsData } from '@testing/data/addons/addons.configured.data';
import { getResourceReferencesData } from '@testing/data/files/resource-references.data';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Service: Files', () => {
  let service: FilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule],
      providers: [FilesService],
    });

    service = TestBed.inject(FilesService);
  });

  it('should test getResourceReferences', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results!: string;
    service.getResourceReferences('reference-url').subscribe({
      next: (result) => {
        results = result;
      },
    });

    const request = httpMock.expectOne(
      'https://addons.staging4.osf.io/v1/resource-references?filter%5Bresource_uri%5D=reference-url'
    );
    expect(request.request.method).toBe('GET');
    request.flush(getResourceReferencesData());

    expect(results).toBe('https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086');
    expect(httpMock.verify).toBeTruthy();
  }));

  it('should test getConfiguredStorageAddons', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let results: any[] = [];
    service.getConfiguredStorageAddons('reference-url').subscribe((result) => {
      results = result;
    });

    let request = httpMock.expectOne(
      'https://addons.staging4.osf.io/v1/resource-references?filter%5Bresource_uri%5D=reference-url'
    );
    expect(request.request.method).toBe('GET');
    request.flush(getResourceReferencesData());

    request = httpMock.expectOne(
      'https://addons.staging4.osf.io/v1/resource-references/3193f97c-e6d8-41a4-8312-b73483442086/configured_storage_addons'
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
        externalStorageServiceId: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
        id: '756579dc-3a24-4849-8866-698a60846ac3',
        resourceType: undefined,
        rootFolderId: '0AIl0aR4C9JAFUk9PVA',
        selectedStorageItemId: '0AIl0aR4C9JAFUk9PVA',
        targetUrl: undefined,
        type: 'configured-storage-addons',
      })
    );

    expect(httpMock.verify).toBeTruthy();
  }));
});
